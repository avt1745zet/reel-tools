import React, { FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BoxProps, CssBaseline, Typography, Toolbar, AppBar, Box, createStyles, createTheme, makeStyles, Tab, Tabs, ThemeProvider } from '@material-ui/core';

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
	const [ currentTabIndex, setCurrentTabIndex ] = React.useState( 0 );

	const classes = useStyles();

	const handleChange = ( event: React.ChangeEvent<unknown>, newValue: number ) => {
		setCurrentTabIndex( newValue );
	};

	return (
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

				<Box className={classes.root}>
					<Tabs className={classes.tabs} value={currentTabIndex} variant='scrollable' orientation='vertical' onChange={handleChange} aria-label='nav-tabs'>
						<Tab label='Convertor' />
						<Tab label='Crypto' />
						<Tab label='RNG Tool' />
					</Tabs>

					<Box className={classes.main} role='main'>
						<TabPanel
							index={0}
							currentIndex={currentTabIndex}
							className={classes.tabPanel}
						>
							<ReelConvertTabContent />
						</TabPanel>
						<TabPanel
							index={1}
							currentIndex={currentTabIndex}
							className={classes.tabPanel}
						>
							<CryptoTabContent />
						</TabPanel>
						<TabPanel
							index={2}
							currentIndex={currentTabIndex}
							className={classes.tabPanel}
						>
							<RNGToolGeneratorTabContent />
						</TabPanel>
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

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