import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import closeIcon from '../assets/close.svg';

// Context shape
const ImagePreviewContext = createContext({
	open: (_src, _opts) => {},
	close: () => {},
	isOpen: false,
});

/**
 * Provider that enables fullscreen preview of images from anywhere in the tree.
 * Usage:
 * 1. Wrap your app (e.g. in main.jsx or App.jsx):
 *    <ImagePreviewProvider><App /></ImagePreviewProvider>
 * 2. In a component: const { open } = useImagePreview();
 *    <img src={url} onClick={() => open(url, { alt: 'Nice pic' })} />
 */
export const ImagePreviewProvider = ({ children }) => {
	const [preview, setPreview] = useState(null); // { src, alt, title }
	const [mounted, setMounted] = useState(false);
	const overlayRef = useRef(null);

	// Ensure portal target exists
	useEffect(() => {
		setMounted(true);
	}, []);

	const close = useCallback(() => setPreview(null), []);

	const open = useCallback((src, opts = {}) => {
		if (!src) return;
		setPreview({ src, alt: opts.alt || '', title: opts.title || '' });
	}, []);

	// ESC key + body scroll lock while open
	useEffect(() => {
		if (!preview) return;
		const onKey = (e) => { if (e.key === 'Escape') close(); };
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = previousOverflow;
		};
	}, [preview, close]);

	// Simple fade-in animation state
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (preview) {
			requestAnimationFrame(() => setVisible(true));
		} else {
			setVisible(false);
		}
	}, [preview]);

	const handleBackdropClick = (e) => {
		// Close only when clicking the dark backdrop itself
		if (e.target === overlayRef.current) close();
	};

	return (
		<ImagePreviewContext.Provider value={{ open, close, isOpen: !!preview }}>
			{children}
			{mounted && preview && createPortal(
				<div
					ref={overlayRef}
					onClick={handleBackdropClick}
					aria-modal="true"
					role="dialog"
					className={`fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
				>
					<button
						onClick={(e) => { e.stopPropagation(); close(); }}
						aria-label="Close image preview"
						className="absolute top-3 right-4 text-white/90 hover:text-white focus:outline-none group"
					>
						<img src={closeIcon} alt="Close" className="w-8 h-8 group-hover:scale-110 transition-transform" />
					</button>
					<div className="max-w-[95vw] max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
						{preview.title && (
							<div className="text-white/80 text-sm font-medium text-center mb-[-4px] px-2 py-1 bg-black/40 rounded-full pointer-events-none select-none">
								{preview.title}
							</div>
						)}
						<img
							src={preview.src}
							alt={preview.alt}
							className="max-w-[95vw] max-h-[85vh] object-contain rounded shadow-2xl select-none"
							draggable={false}
						/>
					</div>
				</div>,
				document.body
			)}
		</ImagePreviewContext.Provider>
	);
};

export const useImagePreview = () => useContext(ImagePreviewContext);

// Optional helper component that automatically wires click -> open
export const PreviewableImage = ({ src, alt = '', title, className = '', onClick, ...rest }) => {
	const { open } = useImagePreview();
	return (
		<img
			src={src}
			alt={alt}
			className={`cursor-pointer ${className}`}
			onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) open(src, { alt, title }); }}
			loading="lazy"
			{...rest}
		/>
	);
};

export default ImagePreviewContext;
