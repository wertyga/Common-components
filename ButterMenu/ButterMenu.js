import FlipMove from 'react-flip-move';

import './ButterMenu.sass'

export default class ButterMenu extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.refs.f.classList.add('appear');
        }, 300);
        setTimeout(() => {
            this.refs.s.classList.add('appear');
        }, 400);
        setTimeout(() => {
            this.refs.t.classList.add('appear');
        }, 500)

    };


    render() {
        return (
            <div className={this.props.open ? 'ButterMenu open' : 'ButterMenu'}>
                <div className="f" ref="f"></div>
                <div className="s" ref="s"></div>
                <div className="t" ref="t"></div>
            </div>
        );
    }
};