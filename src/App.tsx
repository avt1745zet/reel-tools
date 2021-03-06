import React, { FC, ReactElement, useState } from 'react';
import { CssBaseline, Typography, Toolbar, AppBar, Box, createStyles, createTheme, makeStyles, Tab, Tabs, ThemeProvider, IconButton, Hidden, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { HashRouter, Route, Switch, useHistory } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import ExcelReelStripsConverter from './pages/excelReelStripsConverter/ExcelReelStripsConverter';
import JsonFormatCryptor from './pages/jsonFormatCryptor/JsonFormatCryptor';
import ForceSpinCodeGenerator from './pages/forceSpinCodeGenerator/ForceSpinCodeGenerator';
import SymbolPayoutGenerator from './pages/symbolPayoutGenerator/SymbolPayoutGenerator';
import WayGamePayoutCalculator from './pages/wayGamePayoutCalculator/WayGamePayoutCalculator';
import NotFoundPage from './pages/notFound/notFoundPage';

import packageJson from '../package.json';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		root: {
			display: 'flex',
			position: 'relative',
			height: '100vh',
		},
		nav: {
			borderRight: `1px solid ${ theme.palette.divider }`
		},
		tabs: {
			borderRight: `1px solid ${ theme.palette.divider }`,
			marginTop: 74
		},
		main: {
			flex: '1',
			marginTop: 60,
			overflow: 'auto',
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
	const [ isMenuOpen, setIsMenuOpen ] = useState( false );

	const handleMenuButtonClick = () => {
		setIsMenuOpen( true );
	};

	const handleMenuClick = () => {
		setIsMenuOpen( false );
	};

	const classes = useStyles();

	return (
		<ThemeProvider
			theme={defaultTheme}>
			<CssBaseline />
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
							???A useful tool abount reel.
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
				<HashRouter>
					<NavMenu isOpen={isMenuOpen} onClick={handleMenuClick} />
				</HashRouter>
				<Box component='main' className={classes.main} role='main'>
					<HashRouter>
						<Switch>
							<Route exact path='/' component={HomePage} />
							<Route path='/tool/0' component={ExcelReelStripsConverter} />
							<Route path='/tool/1' component={JsonFormatCryptor} />
							<Route path='/tool/2' component={ForceSpinCodeGenerator} />
							<Route path='/tool/3' component={SymbolPayoutGenerator} />
							<Route path='/tool/4' component={WayGamePayoutCalculator} />
							<Route path='*' component={NotFoundPage} />
						</Switch>
					</HashRouter>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

interface NavMenuProps {
	isOpen: boolean;
	onClick (): void;
}

export const NavMenu: FC<NavMenuProps> = ( props: NavMenuProps ) => {
	const { isOpen, onClick } = props;

	const history = useHistory();

	const classes = useStyles();

	const handleChange = ( event: React.ChangeEvent<unknown>, value: number ) => {
		const location = {
			pathname: `/tool/${ value }`
		};
		history.push( location );
	};

	const handleDrawerClick = () => {
		onClick();
	}

	const tabElements: Array<ReactElement> = [
		<Tab key='0' label='Convertor' />,
		<Tab key='1' label='Crypto' />,
		<Tab key='2' label='Force-Spin Tool' />,
		<Tab key='3' label='Symbol Payout Generator' />,
		<Tab key='4' label='Way Game Payout Calculator' />
	];

	return (
		<Route path='*' render={( props ) => {
			let currentIndex: number | boolean = [
				'/tool/0',
				'/tool/1',
				'/tool/2',
				'/tool/3',
				'/tool/4'
			].indexOf( props.location.pathname );
			currentIndex = currentIndex === -1 ? false : currentIndex;

			return (
				<Box component='nav' className={classes.nav}>
					<Hidden smDown>
						<Tabs value={currentIndex} className={classes.tabs} onChange={handleChange} aria-label='nav-tabs' orientation='vertical'>
							{tabElements}
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
								{tabElements}
							</Tabs>
						</Drawer>
					</Hidden>
				</Box>
			);
		}} />
	);
};