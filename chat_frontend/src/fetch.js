let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const fetchData = async (url, method = 'GET', data = null) => {
  try {
      const headers = {
          'Content-Type': 'application/json',
      };

      const body = data ? JSON.stringify(data) : null;

      const response = await fetch(url, {
          method,
          headers,
          body,
          credentials: 'include'
      });

      // Handle 401 with automatic token refresh
      if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
        if (isRefreshing) {
          // Wait for the ongoing refresh to complete
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            // Retry the original request
            return fetch(url, {
              method,
              headers,
              body,
              credentials: 'include'
            });
          });
        }

        isRefreshing = true;

        try {
          // Attempt to refresh the token
          const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
          });

          if (refreshResponse.ok) {
            // Token refreshed successfully, retry original request
            isRefreshing = false;
            processQueue(null);

            return fetch(url, {
              method,
              headers,
              body,
              credentials: 'include'
            });
          } else {
            // Refresh failed, logout user
            isRefreshing = false;
            processQueue(new Error('Token refresh failed'), null);
            
            // Only redirect to login if not already on auth pages
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              window.location.href = '/login';
            }
            throw new Error('Session expired. Please login again.');
          }
        } catch (error) {
          isRefreshing = false;
          processQueue(error, null);
          
          // Only redirect to login if not already on auth pages
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
            window.location.href = '/login';
          }
          throw error;
        }
      }

      return response;
  } catch (error) {
      console.error('Error in API request:', error);
      throw error;
  }
};

export default fetchData
