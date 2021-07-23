import React, { FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BoxProps, CssBaseline, Typography, Toolbar, AppBar, Box, createStyles, createTheme, makeStyles, Tab, Tabs, ThemeProvider, TabsProps } from '@material-ui/core';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';

import { ReelConvertArea } from './components/ReelConverter';
import { JasonCryptor } from './components/JasonCryptor';
import { RNGToolGenerator } from './components/RNGToolGenerator';
import packageJson from '../package.json';

import favicon from './res/favicon/favicon_512.png';

interface TabPanelProps extends BoxProps {
	/**
	 * The index of specified TabPanel.
	 */
	index: number;
	/**
	 * The current index of Tabs.
	 */
	currentIndex: number;
}

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			display: 'flex',
			position: 'relative',
			height: '100vh',
		},
		tabs: {
			borderRight: `1px solid ${ theme.palette.divider }`,
			marginTop: 74
		},
		main: {
			flex: '1',
			marginTop: 60,
			overflow: 'auto'
		},
		tabPanel: {
			padding: 30
		}
	} )
);

const tabCount = 3;

const defaultTheme = createTheme( {
	palette: {
		type: 'light',
	}
} );

// const darkTheme = createTheme( {
// 	palette: {
// 		type: 'dark',
// 	}
// } );

export const App: FC = () => {
	const classes = useStyles();

	return (
		<Router>
			<ThemeProvider
				theme={defaultTheme}>
				<CssBaseline />
				<HelmetProvider>
					<Helmet >
						<title>Reel Tools</title>
						<link rel='icon' type='image/x-icon' href={favicon}></link>
					</Helmet>
				</HelmetProvider>

				<Box>
					<AppBar>
						<Toolbar>
							<Box>
								<Typography
									style={{
										color: 'white'
									}}
									variant='h3'
									display='inline'
								>
									Reel Tools
								</Typography >
								<Typography
									style={{
										color: 'white'
									}}
									variant='caption'
									display='inline'
								>
									※A useful tool abount reel.
								</Typography >
							</Box>
							<Box style={{ marginLeft: 'auto', marginRight: '5px', marginBlock: 'auto', color: 'skyblue' }}>
								<Typography>
									Version: {packageJson.version}
								</Typography >
							</Box>
						</Toolbar>
					</AppBar>

					<Route path='/' render={( { location } ) => {
						let tabURLParam = new URLSearchParams( location.search ).get( 'tab' );
						if ( !tabURLParam ) {
							tabURLParam = ( 0 ).toString();
						}

						let isValidedTabParam = true;
						let tabIndex = Number.parseInt( tabURLParam );

						if ( Number.isNaN( tabIndex ) || tabIndex < 0 || tabIndex >= tabCount ) {
							isValidedTabParam = false;
							tabIndex = 404;
						}

						return (
							<Box className={classes.root}>
								<NavTabs value={isValidedTabParam ? tabIndex : false} className={classes.tabs} variant='scrollable' orientation='vertical' />
								<Box className={classes.main} role='main'>
									<TabPanel
										index={0}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<ReelConvertTabContent />
									</TabPanel>
									<TabPanel
										index={1}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<CryptoTabContent />
									</TabPanel>
									<TabPanel
										index={2}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<RNGToolGeneratorTabContent />
									</TabPanel>
									<TabPanel
										index={404}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<Typography>
											ERROR 404
										</Typography >
									</TabPanel>
								</Box>
							</Box>
						);
					}} />
				</Box>
			</ThemeProvider>
		</Router>
	);
}

interface NavTabsProps extends TabsProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
}

export const NavTabs: FC<NavTabsProps> = ( props: NavTabsProps ) => {
	const history = useHistory();

	const handleChange = ( event: React.ChangeEvent<unknown>, value: number ) => {
		history.push( `?tab=${ value }` );
	};

	return (
		<Tabs {...props} onChange={handleChange} aria-label='nav-tabs'>
			<Tab label='Convertor' />
			<Tab label='Crypto' />
			<Tab label='RNG Tool' />
		</Tabs>
	);
};

export const TabPanel: FC<TabPanelProps> = ( props: TabPanelProps ) => {
	const { index, currentIndex, className, children } = props;

	const visible = currentIndex === index;
	return (
		<Box
			className={className}
			role='tabpanel'
			id={`tab-panel-${ index }`}
			aria-labelledby={`tab-panel-${ index }`}
			hidden={!visible}
		>
			{children}
		</Box>
	);
};

export const ReelConvertTabContent: FC = () => {
	return (
		<Box>
			<ReelConvertArea />
		</Box>
	);
};

export const CryptoTabContent: FC = () => {
	return (
		<Box>
			<JasonCryptor />
		</Box>
	);
};

export const RNGToolGeneratorTabContent: FC = () => {
	return (
		<Box>
			<RNGToolGenerator />
		</Box>
	);
};