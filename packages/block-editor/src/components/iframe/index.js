/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useState,
	createPortal,
	forwardRef,
	useMemo,
	useEffect,
	useRef,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	useResizeObserver,
	useMergeRefs,
	useRefEffect,
	useDisabled,
	useReducedMotion,
} from '@wordpress/compose';
import { __experimentalStyleProvider as StyleProvider } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useBlockSelectionClearer } from '../block-selection-clearer';
import { useWritingFlow } from '../writing-flow';
import { getCompatibilityStyles } from './get-compatibility-styles';
import { store as blockEditorStore } from '../../store';

function bubbleEvent( event, Constructor, frame ) {
	const init = {};

	for ( const key in event ) {
		init[ key ] = event[ key ];
	}

	// Check if the event is a MouseEvent generated within the iframe.
	// If so, adjust the coordinates to be relative to the position of
	// the iframe. This ensures that components such as Draggable
	// receive coordinates relative to the window, instead of relative
	// to the iframe. Without this, the Draggable event handler would
	// result in components "jumping" position as soon as the user
	// drags over the iframe.
	if ( event instanceof frame.contentDocument.defaultView.MouseEvent ) {
		const rect = frame.getBoundingClientRect();
		init.clientX += rect.left;
		init.clientY += rect.top;
	}

	const newEvent = new Constructor( event.type, init );
	if ( init.defaultPrevented ) {
		newEvent.preventDefault();
	}
	const cancelled = ! frame.dispatchEvent( newEvent );

	if ( cancelled ) {
		event.preventDefault();
	}
}

/**
 * Bubbles some event types (keydown, keypress, and dragover) to parent document
 * document to ensure that the keyboard shortcuts and drag and drop work.
 *
 * Ideally, we should remove event bubbling in the future. Keyboard shortcuts
 * should be context dependent, e.g. actions on blocks like Cmd+A should not
 * work globally outside the block editor.
 *
 * @param {Document} iframeDocument Document to attach listeners to.
 */
function useBubbleEvents( iframeDocument ) {
	return useRefEffect( () => {
		const { defaultView } = iframeDocument;
		if ( ! defaultView ) {
			return;
		}
		const { frameElement } = defaultView;
		const html = iframeDocument.documentElement;
		const eventTypes = [ 'dragover', 'mousemove' ];
		const handlers = {};
		for ( const name of eventTypes ) {
			handlers[ name ] = ( event ) => {
				const prototype = Object.getPrototypeOf( event );
				const constructorName = prototype.constructor.name;
				const Constructor = window[ constructorName ];
				bubbleEvent( event, Constructor, frameElement );
			};
			html.addEventListener( name, handlers[ name ] );
		}

		return () => {
			for ( const name of eventTypes ) {
				html.removeEventListener( name, handlers[ name ] );
			}
		};
	} );
}

function Iframe( {
	contentRef,
	children,
	tabIndex = 0,
	scale = 1,
	frameSize = 0,
	readonly,
	forwardedRef: ref,
	title = __( 'Editor canvas' ),
	...props
} ) {
	const { resolvedAssets, isPreviewMode } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		const settings = getSettings();
		return {
			resolvedAssets: settings.__unstableResolvedAssets,
			isPreviewMode: settings.isPreviewMode,
		};
	}, [] );
	const { styles = '', scripts = '' } = resolvedAssets;
	/** @type {[Document, import('react').Dispatch<Document>]} */
	const [ iframeDocument, setIframeDocument ] = useState();
	const initialContainerWidthRef = useRef( 0 );
	const [ bodyClasses, setBodyClasses ] = useState( [] );
	const clearerRef = useBlockSelectionClearer();
	const [ before, writingFlowRef, after ] = useWritingFlow();
	const [ contentResizeListener, { height: contentHeight } ] =
		useResizeObserver();
	const [ containerResizeListener, { width: containerWidth } ] =
		useResizeObserver();
	const prefersReducedMotion = useReducedMotion();

	const setRef = useRefEffect( ( node ) => {
		node._load = () => {
			setIframeDocument( node.contentDocument );
		};
		let iFrameDocument;
		// Prevent the default browser action for files dropped outside of dropzones.
		function preventFileDropDefault( event ) {
			event.preventDefault();
		}
		function onLoad() {
			const { contentDocument, ownerDocument } = node;
			const { documentElement } = contentDocument;
			iFrameDocument = contentDocument;

			documentElement.classList.add( 'block-editor-iframe__html' );

			clearerRef( documentElement );

			// Ideally ALL classes that are added through get_body_class should
			// be added in the editor too, which we'll somehow have to get from
			// the server in the future (which will run the PHP filters).
			setBodyClasses(
				Array.from( ownerDocument.body.classList ).filter(
					( name ) =>
						name.startsWith( 'admin-color-' ) ||
						name.startsWith( 'post-type-' ) ||
						name === 'wp-embed-responsive'
				)
			);

			contentDocument.dir = ownerDocument.dir;

			for ( const compatStyle of getCompatibilityStyles() ) {
				if ( contentDocument.getElementById( compatStyle.id ) ) {
					continue;
				}

				contentDocument.head.appendChild(
					compatStyle.cloneNode( true )
				);

				if ( ! isPreviewMode ) {
					// eslint-disable-next-line no-console
					console.warn(
						`${ compatStyle.id } was added to the iframe incorrectly. Please use block.json or enqueue_block_assets to add styles to the iframe.`,
						compatStyle
					);
				}
			}

			iFrameDocument.addEventListener(
				'dragover',
				preventFileDropDefault,
				false
			);
			iFrameDocument.addEventListener(
				'drop',
				preventFileDropDefault,
				false
			);
			// Prevent clicks on links from navigating away. Note that links
			// inside `contenteditable` are already disabled by the browser, so
			// this is for links in blocks outside of `contenteditable`.
			iFrameDocument.addEventListener( 'click', ( event ) => {
				if ( event.target.tagName === 'A' ) {
					event.preventDefault();

					// Appending a hash to the current URL will not reload the
					// page. This is useful for e.g. footnotes.
					const href = event.target.getAttribute( 'href' );
					if ( href.startsWith( '#' ) ) {
						iFrameDocument.defaultView.location.hash =
							href.slice( 1 );
					}
				}
			} );
		}

		node.addEventListener( 'load', onLoad );

		return () => {
			delete node._load;
			node.removeEventListener( 'load', onLoad );
			iFrameDocument?.removeEventListener(
				'dragover',
				preventFileDropDefault
			);
			iFrameDocument?.removeEventListener(
				'drop',
				preventFileDropDefault
			);
		};
	}, [] );

	const [ iframeWindowInnerHeight, setIframeWindowInnerHeight ] = useState();

	const iframeResizeRef = useRefEffect( ( node ) => {
		const nodeWindow = node.ownerDocument.defaultView;

		setIframeWindowInnerHeight( nodeWindow.innerHeight );
		const onResize = () => {
			setIframeWindowInnerHeight( nodeWindow.innerHeight );
		};
		nodeWindow.addEventListener( 'resize', onResize );
		return () => {
			nodeWindow.removeEventListener( 'resize', onResize );
		};
	}, [] );

	const [ windowInnerWidth, setWindowInnerWidth ] = useState();

	const windowResizeRef = useRefEffect( ( node ) => {
		const nodeWindow = node.ownerDocument.defaultView;

		setWindowInnerWidth( nodeWindow.innerWidth );
		const onResize = () => {
			setWindowInnerWidth( nodeWindow.innerWidth );
		};
		nodeWindow.addEventListener( 'resize', onResize );
		return () => {
			nodeWindow.removeEventListener( 'resize', onResize );
		};
	}, [] );

	const isZoomedOut = scale !== 1;

	useEffect( () => {
		if ( ! isZoomedOut ) {
			initialContainerWidthRef.current = containerWidth;
		}
	}, [ containerWidth, isZoomedOut ] );

	const scaleContainerWidth = Math.max(
		initialContainerWidthRef.current,
		containerWidth
	);

	const frameSizeValue = parseInt( frameSize );

	const maxWidth = 750;
	const scaleValue =
		scale === 'auto-scaled'
			? ( Math.min( containerWidth, maxWidth ) - frameSizeValue * 2 ) /
			  scaleContainerWidth
			: scale;

	const prevScaleRef = useRef( scaleValue );
	const prevFrameSizeRef = useRef( frameSizeValue );
	const prevClientHeightRef = useRef( /* Initialized in the useEffect. */ );

	const disabledRef = useDisabled( { isDisabled: ! readonly } );
	const bodyRef = useMergeRefs( [
		useBubbleEvents( iframeDocument ),
		contentRef,
		clearerRef,
		writingFlowRef,
		disabledRef,
		// Avoid resize listeners when not needed, these will trigger
		// unnecessary re-renders when animating the iframe width, or when
		// expanding preview iframes.
		isZoomedOut ? iframeResizeRef : null,
	] );

	// Correct doctype is required to enable rendering in standards
	// mode. Also preload the styles to avoid a flash of unstyled
	// content.
	const html = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<base href="${ window.location.origin }">
		<script>window.frameElement._load()</script>
		<style>
			html{
				height: auto !important;
				min-height: 100%;
			}
			/* Lowest specificity to not override global styles */
			:where(body) {
				margin: 0;
				/* Default background color in case zoom out mode background
				colors the html element */
				background-color: white;
			}
		</style>
		${ styles }
		${ scripts }
	</head>
	<body>
		<script>document.currentScript.parentElement.remove()</script>
	</body>
</html>`;

	const [ src, cleanup ] = useMemo( () => {
		const _src = URL.createObjectURL(
			new window.Blob( [ html ], { type: 'text/html' } )
		);
		return [ _src, () => URL.revokeObjectURL( _src ) ];
	}, [ html ] );

	useEffect( () => cleanup, [ cleanup ] );

	useEffect( () => {
		if (
			! iframeDocument ||
			// HACK: Checking if isZoomedOut differs from prevIsZoomedOut here
			// instead of the dependency array to appease the linter.
			( scaleValue === 1 ) === ( prevScaleRef.current === 1 )
		) {
			return;
		}

		// Unscaled height of the current iframe container.
		const clientHeight = iframeDocument.documentElement.clientHeight;

		// Scaled height of the current iframe content.
		const scrollHeight = iframeDocument.documentElement.scrollHeight;

		// Previous scale value.
		const prevScale = prevScaleRef.current;

		// Unscaled size of the previous padding around the iframe content.
		const prevFrameSize = prevFrameSizeRef.current;

		// Unscaled height of the previous iframe container.
		const prevClientHeight = prevClientHeightRef.current ?? clientHeight;

		// We can't trust the set value from contentHeight, as it was measured
		// before the zoom out mode was changed. After zoom out mode is changed,
		// appenders may appear or disappear, so we need to get the height from
		// the iframe at this point when we're about to animate the zoom out.
		// The iframe scrollTop, scrollHeight, and clientHeight will all be
		// accurate. The client height also does change when the zoom out mode
		// is toggled, as the bottom bar about selecting the template is
		// added/removed when toggling zoom out mode.
		const scrollTop = iframeDocument.documentElement.scrollTop;

		// Step 0: Start with the current scrollTop.
		let scrollTopNext = scrollTop;

		// Step 1: Undo the effects of the previous scale and frame around the
		// midpoint of the visible area.
		scrollTopNext =
			( scrollTopNext + prevClientHeight / 2 - prevFrameSize ) /
				prevScale -
			prevClientHeight / 2;

		// Step 2: Apply the new scale and frame around the midpoint of the
		// visible area.
		scrollTopNext =
			( scrollTopNext + clientHeight / 2 ) * scaleValue +
			frameSizeValue -
			clientHeight / 2;

		// Step 3: Handle an edge case so that you scroll to the top of the
		// iframe if the top of the iframe content is visible in the container.
		// The same edge case for the bottom is skipped because changing content
		// makes calculating it impossible.
		scrollTopNext = scrollTop <= prevFrameSize ? 0 : scrollTopNext;

		// This is the scrollTop value if you are scrolled to the bottom of the
		// iframe. We can't just let the browser handle it because we need to
		// animate the scaling.
		const maxScrollTop =
			scrollHeight * ( scaleValue / prevScale ) +
			frameSizeValue * 2 -
			clientHeight;

		// Step 4: Clamp the scrollTopNext between the minimum and maximum
		// possible scrollTop positions. Round the value to avoid subpixel
		// truncation by the browser which sometimes causes a 1px error.
		scrollTopNext = Math.round(
			Math.min(
				Math.max( 0, scrollTopNext ),
				Math.max( 0, maxScrollTop )
			)
		);

		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-scroll-top',
			`${ scrollTop }px`
		);

		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-scroll-top-next',
			`${ scrollTopNext }px`
		);

		iframeDocument.documentElement.classList.add( 'zoom-out-animation' );

		function onZoomOutTransitionEnd() {
			// Remove the position fixed for the animation.
			iframeDocument.documentElement.classList.remove(
				'zoom-out-animation'
			);

			// Update previous values.
			prevClientHeightRef.current = clientHeight;
			prevFrameSizeRef.current = frameSizeValue;
			prevScaleRef.current = scaleValue;

			// Set the final scroll position that was just animated to.
			// Disable reason: Eslint isn't smart enough to know that this is a
			// DOM element. https://github.com/facebook/react/issues/31483
			// eslint-disable-next-line react-compiler/react-compiler
			iframeDocument.documentElement.scrollTop = scrollTopNext;
		}

		let raf;
		if ( prefersReducedMotion ) {
			// Hack: Wait for the window values to recalculate.
			raf = iframeDocument.defaultView.requestAnimationFrame(
				onZoomOutTransitionEnd
			);
		} else {
			iframeDocument.documentElement.addEventListener(
				'transitionend',
				onZoomOutTransitionEnd,
				{ once: true }
			);
		}

		return () => {
			iframeDocument.documentElement.style.removeProperty(
				'--wp-block-editor-iframe-zoom-out-scroll-top'
			);
			iframeDocument.documentElement.style.removeProperty(
				'--wp-block-editor-iframe-zoom-out-scroll-top-next'
			);
			iframeDocument.documentElement.classList.remove(
				'zoom-out-animation'
			);
			if ( prefersReducedMotion ) {
				iframeDocument.defaultView.cancelAnimationFrame( raf );
			} else {
				iframeDocument.documentElement.removeEventListener(
					'transitionend',
					onZoomOutTransitionEnd
				);
			}
		};
	}, [ iframeDocument, scaleValue, frameSizeValue, prefersReducedMotion ] );

	// Toggle zoom out CSS Classes only when zoom out mode changes. We could add these into the useEffect
	// that controls settings the CSS variables, but then we would need to do more work to ensure we're
	// only toggling these when the zoom out mode changes, as that useEffect is also triggered by a large
	// number of dependencies.
	useEffect( () => {
		if ( ! iframeDocument ) {
			return;
		}

		if ( isZoomedOut ) {
			iframeDocument.documentElement.classList.add( 'is-zoomed-out' );
		} else {
			// HACK: Since we can't remove this in the cleanup, we need to do it here.
			iframeDocument.documentElement.classList.remove( 'is-zoomed-out' );
		}

		return () => {
			// HACK: Skipping cleanup because it causes issues with the zoom out
			// animation. More refactoring is needed to fix this properly.
			// iframeDocument.documentElement.classList.remove( 'is-zoomed-out' );
		};
	}, [ iframeDocument, isZoomedOut ] );

	// Calculate the scaling and CSS variables for the zoom out canvas
	useEffect( () => {
		if ( ! iframeDocument ) {
			return;
		}

		// Note: When we initialize the zoom out when the canvas is smaller (sidebars open),
		// initialContainerWidthRef will be smaller than the full page, and reflow will happen
		// when the canvas area becomes larger due to sidebars closing. This is a known but
		// minor divergence for now.

		// This scaling calculation has to happen within the JS because CSS calc() can
		// only divide and multiply by a unitless value. I.e. calc( 100px / 2 ) is valid
		// but calc( 100px / 2px ) is not.
		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-scale',
			scaleValue
		);

		// frameSize has to be a px value for the scaling and frame size to be computed correctly.
		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-frame-size',
			typeof frameSize === 'number' ? `${ frameSize }px` : frameSize
		);
		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-content-height',
			`${ contentHeight }px`
		);
		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-inner-height',
			`${ iframeWindowInnerHeight }px`
		);
		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-container-width',
			`${ containerWidth }px`
		);
		iframeDocument.documentElement.style.setProperty(
			'--wp-block-editor-iframe-zoom-out-scale-container-width',
			`${ scaleContainerWidth }px`
		);

		return () => {
			// HACK: Skipping cleanup because it causes issues with the zoom out
			// animation. More refactoring is needed to fix this properly.
			// iframeDocument.documentElement.style.removeProperty(
			// 	'--wp-block-editor-iframe-zoom-out-scale'
			// );
			// iframeDocument.documentElement.style.removeProperty(
			// 	'--wp-block-editor-iframe-zoom-out-frame-size'
			// );
			// iframeDocument.documentElement.style.removeProperty(
			// 	'--wp-block-editor-iframe-zoom-out-content-height'
			// );
			// iframeDocument.documentElement.style.removeProperty(
			// 	'--wp-block-editor-iframe-zoom-out-inner-height'
			// );
			// iframeDocument.documentElement.style.removeProperty(
			// 	'--wp-block-editor-iframe-zoom-out-container-width'
			// );
			// iframeDocument.documentElement.style.removeProperty(
			// 	'--wp-block-editor-iframe-zoom-out-scale-container-width'
			// );
		};
	}, [
		scaleValue,
		frameSize,
		iframeDocument,
		iframeWindowInnerHeight,
		contentHeight,
		containerWidth,
		windowInnerWidth,
		isZoomedOut,
		scaleContainerWidth,
	] );

	// Make sure to not render the before and after focusable div elements in view
	// mode. They're only needed to capture focus in edit mode.
	const shouldRenderFocusCaptureElements = tabIndex >= 0 && ! isPreviewMode;

	const iframe = (
		<>
			{ shouldRenderFocusCaptureElements && before }
			{ /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */ }
			<iframe
				{ ...props }
				style={ {
					...props.style,
					height: props.style?.height,
					border: 0,
				} }
				ref={ useMergeRefs( [ ref, setRef ] ) }
				tabIndex={ tabIndex }
				// Correct doctype is required to enable rendering in standards
				// mode. Also preload the styles to avoid a flash of unstyled
				// content.
				src={ src }
				title={ title }
				onKeyDown={ ( event ) => {
					if ( props.onKeyDown ) {
						props.onKeyDown( event );
					}
					// If the event originates from inside the iframe, it means
					// it bubbled through the portal, but only with React
					// events. We need to to bubble native events as well,
					// though by doing so we also trigger another React event,
					// so we need to stop the propagation of this event to avoid
					// duplication.
					if (
						event.currentTarget.ownerDocument !==
						event.target.ownerDocument
					) {
						// We should only stop propagation of the React event,
						// the native event should further bubble inside the
						// iframe to the document and window.
						// Alternatively, we could consider redispatching the
						// native event in the iframe.
						const { stopPropagation } = event.nativeEvent;
						event.nativeEvent.stopPropagation = () => {};
						event.stopPropagation();
						event.nativeEvent.stopPropagation = stopPropagation;
						bubbleEvent(
							event,
							window.KeyboardEvent,
							event.currentTarget
						);
					}
				} }
			>
				{ iframeDocument &&
					createPortal(
						// We want to prevent React events from bubbling throught the iframe
						// we bubble these manually.
						/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
						<body
							ref={ bodyRef }
							className={ clsx(
								'block-editor-iframe__body',
								'editor-styles-wrapper',
								...bodyClasses
							) }
						>
							{ contentResizeListener }
							<StyleProvider document={ iframeDocument }>
								{ children }
							</StyleProvider>
						</body>,
						iframeDocument.documentElement
					) }
			</iframe>
			{ shouldRenderFocusCaptureElements && after }
		</>
	);

	return (
		<div className="block-editor-iframe__container" ref={ windowResizeRef }>
			{ containerResizeListener }
			<div
				className={ clsx(
					'block-editor-iframe__scale-container',
					isZoomedOut && 'is-zoomed-out'
				) }
				style={ {
					'--wp-block-editor-iframe-zoom-out-scale-container-width':
						isZoomedOut && `${ scaleContainerWidth }px`,
				} }
			>
				{ iframe }
			</div>
		</div>
	);
}

function IframeIfReady( props, ref ) {
	const isInitialised = useSelect(
		( select ) =>
			select( blockEditorStore ).getSettings().__internalIsInitialized,
		[]
	);

	// We shouldn't render the iframe until the editor settings are initialised.
	// The initial settings are needed to get the styles for the srcDoc, which
	// cannot be changed after the iframe is mounted. srcDoc is used to to set
	// the initial iframe HTML, which is required to avoid a flash of unstyled
	// content.
	if ( ! isInitialised ) {
		return null;
	}

	return <Iframe { ...props } forwardedRef={ ref } />;
}

export default forwardRef( IframeIfReady );
