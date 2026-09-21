import { Outlet } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
// The file really is spelled this way: the import matches it rather than
// correcting it, since a rename is its own change.
import BackToTopButton from '../shared/BakToTopButton'

/**
 * The chrome every ordinary page sits inside: the navbar above, the footer
 * below, and the back to top control.
 *
 * A layout route rather than markup wrapped around the router, so a page can
 * opt out of all of it by sitting outside this route. The print view of a
 * report card is the one that does: a sheet meant for paper cannot carry a
 * site navbar, and hiding it only at print time would still leave it on screen
 * in the preview.
 */
const AppShell = () => (
  <div className='app-shell'>
    <Navbar />
    <div className='app-shell__main'>
      <Outlet />
    </div>
    <Footer />
    <BackToTopButton />
  </div>
)

export default AppShell
