/**
 * Internal dependencies
 */
import WelcomeGuideEditor from './editor';
import WelcomeGuideStyles from './styles';
import WelcomeGuidePage from './page';
import WelcomeGuideTemplate from './template';

export default function WelcomeGuide( { postType } ) {
	return (
		<>
			<WelcomeGuideEditor />
			<WelcomeGuideStyles />
			{ postType === 'page' && <WelcomeGuidePage /> }
			{ postType === 'wp_template' && <WelcomeGuideTemplate /> }
		</>
	);
}
