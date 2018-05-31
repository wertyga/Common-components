import clearSession from "../../../common/functions/clearSession";

import Loading from '../Loading/Loading';

import './ChangableInput.sass';


export default class ChangableInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.text,
            text: this.props.text,
            editing: false,
            loading: false,
            errors: ''
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.state.editing !== prevState.editing) {
            if(this.state.editing) {
                this.input.focus();
                this.input.addEventListener('keyup', this.inputKeyPress);
                document.body.addEventListener('click', this.bodyEvents);
            } else {
                this.input.blur();
                this.input.removeEventListener('keyup', this.inputKeyPress);
                document.body.removeEventListener('click', this.bodyEvents);
            }
        };
    };

    bodyEvents = e => {
        this.inputKeyPress(e);
    };

    onChangeInput = e => {
        this.setState({
            value: e.target.value,
            errors: ''
        });
        this.props.clearError && this.props.clearError();
    };

    confirmChanging = () => {
        if(this.state.value === this.state.text) {
            this.cancelChanging();
            return;
        }
        const errors = this.props.validateText && this.props.validateText(this.state.value);
        if(!this.state.value || errors) {
            this.setState({ errors: errors || 'Field can not be blank' });
            this.cancelChanging();
            return;
        };

        document.body.removeEventListener('click', this.bodyEvents);
        return this.props.confirmChanging && this.props.confirmChanging(this.state.value)
            .then(() => this.setState({ text: this.state.value, editing: false }))
            .catch(err => {
                this.setState({ errors: clearSession(this, err), loading: false });
                this.cancelChanging();
            })
    };

    cancelChanging = () => {
        this.setState({ value: this.state.text, editing: false });
    };

    inputKeyPress = e => {
        if(e && e.keyCode === 13) {
            this.confirmChanging();
        } else if(e && e.keyCode === 27){
            this.cancelChanging();
        } else if(e && !e.keyCode) {
            this.confirmChanging();
        };
    };

    render() {
        return (
            <div className="ChangableInput" onClick={() => this.setState({ editing: true })}>
                {this.state.loading && <Loading />}
                <input type="text"
                       ref={node => this.input = node}
                       onChange={this.onChangeInput}
                       value={this.state.value}
                       style={{ display: this.state.editing ? 'block' : 'none'}}
                       disabled={this.props.disabled}
                />
                <div className="text"
                     style={{ display: !this.state.editing ? 'block' : 'none'}}
                >{this.state.text}</div>
                {this.state.errors && <div className="error">{this.state.errors}</div>}
            </div>
        );
    };
};

ChangableInput.propTypes = {
    text: PropTypes.string.isRequired, // Simple text
    disabled: PropTypes.bool, // Disable input
    confirmChanging: PropTypes.func, // Function to confirm changing in parent component, that returns changed text (like: fetching changing to DB)
    validateText: PropTypes.func, // Validate text changing from parent component
};