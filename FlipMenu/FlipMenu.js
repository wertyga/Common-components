import AddressMenu from '../AddressMenu/AddressMenu';
import NavMenu from '../NavMenu/NavMenu';

import './FlipMenu.sass';

export default class FlipMenu extends React.Component {
    render() {
        return (
                <div className="FlipMenu">
                    {this.props.address ? <AddressMenu /> : <NavMenu />}
                </div>
        );
    }
};