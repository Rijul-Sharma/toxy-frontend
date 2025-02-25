const uploadFile = async (url, file, additionalData = {}) => {
    try {
        const formData = new FormData();
        formData.append('image', file); 
        Object.keys(additionalData).forEach((key) => {
            formData.append(key, additionalData[key]); 
        });

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadFile