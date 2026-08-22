import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router'

function Layout() {
	return (
		<>
			<main id='main'>
				<Header />
					<main id='second-main'>
							<Outlet />
					</main>
				<Footer />
			</main>
		</>
	)
}

export default Layout
