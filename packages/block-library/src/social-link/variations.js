/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AmazonIcon,
	BandcampIcon,
	BehanceIcon,
	BlueskyIcon,
	ChainIcon,
	CodepenIcon,
	DeviantArtIcon,
	DiscordIcon,
	DribbbleIcon,
	DropboxIcon,
	EtsyIcon,
	FacebookIcon,
	FeedIcon,
	FivehundredpxIcon,
	FlickrIcon,
	FoursquareIcon,
	GoodreadsIcon,
	GoogleIcon,
	GitHubIcon,
	GravatarIcon,
	InstagramIcon,
	LastfmIcon,
	LinkedInIcon,
	MailIcon,
	MastodonIcon,
	MeetupIcon,
	MediumIcon,
	PatreonIcon,
	PinterestIcon,
	PocketIcon,
	RedditIcon,
	SkypeIcon,
	SnapchatIcon,
	SoundCloudIcon,
	SpotifyIcon,
	TelegramIcon,
	ThreadsIcon,
	TiktokIcon,
	TumblrIcon,
	TwitchIcon,
	TwitterIcon,
	VimeoIcon,
	VkIcon,
	WhatsAppIcon,
	WordPressIcon,
	XIcon,
	YelpIcon,
	YouTubeIcon,
} from './icons';

const variations = [
	{
		isDefault: true,
		name: 'wordpress',
		attributes: { service: 'wordpress' },
		title: __( 'WordPress' ),
		icon: WordPressIcon,
	},

	{
		name: 'fivehundredpx',
		attributes: { service: 'fivehundredpx' },
		title: __( '500px' ),
		icon: FivehundredpxIcon,
	},
	{
		name: 'amazon',
		attributes: { service: 'amazon' },
		title: __( 'Amazon' ),
		icon: AmazonIcon,
	},
	{
		name: 'bandcamp',
		attributes: { service: 'bandcamp' },
		title: __( 'Bandcamp' ),
		icon: BandcampIcon,
	},
	{
		name: 'behance',
		attributes: { service: 'behance' },
		title: __( 'Behance' ),
		icon: BehanceIcon,
	},
	{
		name: 'bluesky',
		attributes: { service: 'bluesky' },
		title: __( 'Bluesky' ),
		icon: BlueskyIcon,
	},
	{
		name: 'chain',
		attributes: { service: 'chain' },
		title: __( 'Link' ),
		icon: ChainIcon,
	},
	{
		name: 'codepen',
		attributes: { service: 'codepen' },
		title: __( 'CodePen' ),
		icon: CodepenIcon,
	},
	{
		name: 'deviantart',
		attributes: { service: 'deviantart' },
		title: __( 'DeviantArt' ),
		icon: DeviantArtIcon,
	},
	{
		name: 'discord',
		attributes: { service: 'discord' },
		title: __( 'Discord' ),
		icon: DiscordIcon,
	},
	{
		name: 'dribbble',
		attributes: { service: 'dribbble' },
		title: __( 'Dribbble' ),
		icon: DribbbleIcon,
	},
	{
		name: 'dropbox',
		attributes: { service: 'dropbox' },
		title: __( 'Dropbox' ),
		icon: DropboxIcon,
	},
	{
		name: 'etsy',
		attributes: { service: 'etsy' },
		title: __( 'Etsy' ),
		icon: EtsyIcon,
	},
	{
		name: 'facebook',
		attributes: { service: 'facebook' },
		title: __( 'Facebook' ),
		icon: FacebookIcon,
	},
	{
		name: 'feed',
		attributes: { service: 'feed' },
		title: __( 'RSS Feed' ),
		icon: FeedIcon,
	},
	{
		name: 'flickr',
		attributes: { service: 'flickr' },
		title: __( 'Flickr' ),
		icon: FlickrIcon,
	},
	{
		name: 'foursquare',
		attributes: { service: 'foursquare' },
		title: __( 'Foursquare' ),
		icon: FoursquareIcon,
	},
	{
		name: 'goodreads',
		attributes: { service: 'goodreads' },
		title: __( 'Goodreads' ),
		icon: GoodreadsIcon,
	},
	{
		name: 'google',
		attributes: { service: 'google' },
		title: __( 'Google' ),
		icon: GoogleIcon,
	},
	{
		name: 'github',
		attributes: { service: 'github' },
		title: __( 'GitHub' ),
		icon: GitHubIcon,
	},
	{
		name: 'gravatar',
		attributes: { service: 'gravatar' },
		title: __( 'Gravatar' ),
		icon: GravatarIcon,
	},
	{
		name: 'instagram',
		attributes: { service: 'instagram' },
		title: __( 'Instagram' ),
		icon: InstagramIcon,
	},
	{
		name: 'lastfm',
		attributes: { service: 'lastfm' },
		title: __( 'Last.fm' ),
		icon: LastfmIcon,
	},
	{
		name: 'linkedin',
		attributes: { service: 'linkedin' },
		title: __( 'LinkedIn' ),
		icon: LinkedInIcon,
	},
	{
		name: 'mail',
		attributes: { service: 'mail' },
		title: __( 'Mail' ),
		keywords: [ 'email', 'e-mail' ],
		icon: MailIcon,
	},
	{
		name: 'mastodon',
		attributes: { service: 'mastodon' },
		title: __( 'Mastodon' ),
		icon: MastodonIcon,
	},
	{
		name: 'meetup',
		attributes: { service: 'meetup' },
		title: __( 'Meetup' ),
		icon: MeetupIcon,
	},
	{
		name: 'medium',
		attributes: { service: 'medium' },
		title: __( 'Medium' ),
		icon: MediumIcon,
	},
	{
		name: 'patreon',
		attributes: { service: 'patreon' },
		title: __( 'Patreon' ),
		icon: PatreonIcon,
	},
	{
		name: 'pinterest',
		attributes: { service: 'pinterest' },
		title: __( 'Pinterest' ),
		icon: PinterestIcon,
	},
	{
		name: 'pocket',
		attributes: { service: 'pocket' },
		title: __( 'Pocket' ),
		icon: PocketIcon,
	},
	{
		name: 'reddit',
		attributes: { service: 'reddit' },
		title: __( 'Reddit' ),
		icon: RedditIcon,
	},
	{
		name: 'skype',
		attributes: { service: 'skype' },
		title: __( 'Skype' ),
		icon: SkypeIcon,
	},
	{
		name: 'snapchat',
		attributes: { service: 'snapchat' },
		title: __( 'Snapchat' ),
		icon: SnapchatIcon,
	},
	{
		name: 'soundcloud',
		attributes: { service: 'soundcloud' },
		title: __( 'SoundCloud' ),
		icon: SoundCloudIcon,
	},
	{
		name: 'spotify',
		attributes: { service: 'spotify' },
		title: __( 'Spotify' ),
		icon: SpotifyIcon,
	},
	{
		name: 'telegram',
		attributes: { service: 'telegram' },
		title: __( 'Telegram' ),
		icon: TelegramIcon,
	},
	{
		name: 'threads',
		attributes: { service: 'threads' },
		title: __( 'Threads' ),
		icon: ThreadsIcon,
	},
	{
		name: 'tiktok',
		attributes: { service: 'tiktok' },
		title: __( 'TikTok' ),
		icon: TiktokIcon,
	},
	{
		name: 'tumblr',
		attributes: { service: 'tumblr' },
		title: __( 'Tumblr' ),
		icon: TumblrIcon,
	},
	{
		name: 'twitch',
		attributes: { service: 'twitch' },
		title: __( 'Twitch' ),
		icon: TwitchIcon,
	},
	{
		name: 'twitter',
		attributes: { service: 'twitter' },
		title: __( 'Twitter' ),
		icon: TwitterIcon,
	},
	{
		name: 'vimeo',
		attributes: { service: 'vimeo' },
		title: __( 'Vimeo' ),
		icon: VimeoIcon,
	},
	{
		name: 'vk',
		attributes: { service: 'vk' },
		title: __( 'VK' ),
		icon: VkIcon,
	},
	{
		name: 'whatsapp',
		attributes: { service: 'whatsapp' },
		title: __( 'WhatsApp' ),
		icon: WhatsAppIcon,
	},
	{
		name: 'x',
		attributes: { service: 'x' },
		keywords: [ 'twitter' ],
		title: __( 'X' ),
		icon: XIcon,
	},
	{
		name: 'yelp',
		attributes: { service: 'yelp' },
		title: __( 'Yelp' ),
		icon: YelpIcon,
	},
	{
		name: 'youtube',
		attributes: { service: 'youtube' },
		title: __( 'YouTube' ),
		icon: YouTubeIcon,
	},
];

/**
 * Add `isActive` function to all `social link` variations, if not defined.
 * `isActive` function is used to find a variation match from a created
 *  Block by providing its attributes.
 */
variations.forEach( ( variation ) => {
	if ( variation.isActive ) {
		return;
	}
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.service === variationAttributes.service;
} );

export default variations;
