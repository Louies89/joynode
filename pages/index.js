import Head from 'next/head'
import Header from '../components/NavBar';

export default function Index() {
	return (
		<div>
			<Head>
				<title>Home</title>
				<link rel="stylesheet" crossOrigin="anonymous"   //Add Boot Strap link in this way only for first loading (Read the advandatge of loading BootStarp from CDN in https://www.w3schools.com/bootstrap/bootstrap_get_started.asp)
					href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
					integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" />

				<link rel="stylesheet"  //Add font-awesome
				href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css"/>  
			</Head>
			<Header/>
			<p>Hello Joy</p>
		</div>
	);
}