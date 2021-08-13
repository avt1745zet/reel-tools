import React, { FC, useState } from 'react';
import { BoxProps, CssBaseline, Typography, Toolbar, AppBar, Box, createStyles, createTheme, makeStyles, Tab, Tabs, ThemeProvider, IconButton, Hidden, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';

import ExcelReelStripsConverter from './pages/excelReelStripsConverter/ExcelReelStripsConverter';
import JsonFormatCryptor from './pages/jsonFormatCryptor/JsonFormatCryptor';
import RNGToolCodeGenerator from './pages/RNGToolCodeGenerator/RNGToolCodeGenerator';
import SymbolPayoutGenerator from './pages/symbolPayoutGenerator/SymbolPayoutGenerator';
import WayGamePayoutCalculator from './pages/wayGamePayoutCalculator/WayGamePayoutCalculator';

import packageJson from '../package.json';

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

const tabCount = 5;

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
	const [ isMenuOpen, setIsMenuOpen ] = useState( false );

	const handleMenuButtonClick = () => {
		setIsMenuOpen( true );
	};

	const handleMenuClick = () => {
		setIsMenuOpen( false );
	};

	const classes = useStyles();

	return (
		<Router>
			<ThemeProvider
				theme={defaultTheme}>
				<CssBaseline />
				<Box>
					<AppBar>
						<Toolbar>
							<Hidden mdUp>
								<IconButton
									color='inherit'
									edge="start"
									onClick={handleMenuButtonClick}
								>
									<MenuIcon />
								</IconButton>
							</Hidden>
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
								<NavMenu currentIndex={isValidedTabParam ? tabIndex : false} isOpen={isMenuOpen} onClick={handleMenuClick} />
								<Box component='main' className={classes.main} role='main'>
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
										index={3}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<SymbolPayoutGeneratorTabContent />
									</TabPanel>
									<TabPanel
										index={4}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<WayGamePayoutCalculatorTabContent />
									</TabPanel>
									<TabPanel
										index={404}
										currentIndex={tabIndex}
										className={classes.tabPanel}
									>
										<Typography variant='h2'>
											ERROR 404
										</Typography >
										<Typography variant='body1'>
											This page not found :(
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

interface NavMenuProps {
	currentIndex: number | boolean;
	isOpen: boolean;
	onClick (): void;
}

export const NavMenu: FC<NavMenuProps> = ( props: NavMenuProps ) => {
	const { currentIndex, isOpen, onClick } = props;

	const history = useHistory();

	const classes = useStyles();

	const handleChange = ( event: React.ChangeEvent<unknown>, value: number ) => {
		const location = {
			pathname: history.location.pathname,
			search: `tab=${ value }`
		};
		history.push( location );
	};

	const handleDrawerClick = () => {
		onClick();
	}

	return (
		<nav>
			<Hidden smDown>
				<Tabs value={currentIndex} className={classes.tabs} onChange={handleChange} aria-label='nav-tabs' orientation='vertical'>
					<Tab label='Convertor' />
					<Tab label='Crypto' />
					<Tab label='RNG Tool' />
					<Tab label='Symbol Payout Generator' />
					<Tab label='Way Game Payout Calculator' />
				</Tabs>
			</Hidden>
			<Hidden mdUp>
				<Drawer
					variant='temporary'
					anchor='left'
					open={isOpen}
					onClick={handleDrawerClick}
				>
					<Tabs value={currentIndex} className={classes.tabs} onChange={handleChange} centered={true} orientation='vertical' aria-label='nav-tabs'>
						<Tab label='Convertor' />
						<Tab label='Crypto' />
						<Tab label='RNG Tool' />
						<Tab label='Symbol Payout Generator' />
						<Tab label='Way Game Payout Calculator' />
					</Tabs>
				</Drawer>
			</Hidden>
		</nav>
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
			<ExcelReelStripsConverter />
		</Box>
	);
};

export const CryptoTabContent: FC = () => {
	return (
		<Box>
			<JsonFormatCryptor />
		</Box>
	);
};

export const RNGToolGeneratorTabContent: FC = () => {
	return (
		<Box>
			<RNGToolCodeGenerator />
		</Box>
	);
};

export const SymbolPayoutGeneratorTabContent: FC = () => {
	return (
		<Box>
			<SymbolPayoutGenerator />
		</Box>
	);
};

export const WayGamePayoutCalculatorTabContent: FC = () => {
	return (
		<Box>
			<WayGamePayoutCalculator />
		</Box>
	);
};