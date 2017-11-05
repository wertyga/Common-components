import axios from 'axios';

import Loader from 'material-ui/CircularProgress';
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left';
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right';

import classnames from 'classnames';


import './Slider.sass';
import inlineStyles from '../../styles/inlineStyles';


export default class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sliderImages: [],
            loading: false,
            chosenImage: 0,
            errors: ''
        };
    };

    componentDidMount() {
        if(!this.props.fetchImageRoute) return;
        this.setState({
            loading: true
        });
        axios.get(this.props.fetchImageRoute)
            .then(res => {
                this.setState({
                    sliderImages: res.data || [],
                    loading: false
                });
                if(this.props.autoPlay) this.runAutoPlay();
                if(this.props.slide) {
                    this.refs.images.style.width = this.refs.images.children[0].offsetWidth * this.refs.images.children.length + 'px';
                }
            })
            .catch(err => {
                this.setState({
                    errors: err.response ? err.response.data : err.message,
                    loading: false
                });
            });
    };

    componentWillUnmount() {
        if(this.changeTimer) clearInterval(this.changeTimer)
    };

    runAutoPlay = () => {
        this.changeTimer = setInterval(() => {
            return this.changeImage('right');
        }, 3000)
    };

    changeImage = opt => {
        let i = this.state.chosenImage;
        let totalImages = this.refs.images.children.length;
        i = opt === 'left' ? --i : ++i;
        if(i < 0) {
            if(this.props.infinite) {
                i = totalImages - 1;
            } else {
                return;
            };
        } else if(i > totalImages - 1) {
            if(this.props.infinite) {
                i = 0;
            } else {
                return;
            };
        }
        this.setState({
            chosenImage: i
        });
        if(this.props.dynamicHeight) {
            this.dynamicHeight();
        }
    };

    dynamicHeight = () => {
        let itemImage = this.refs.images.querySelector('.item-image.show');
        this.refs.images.style.height = itemImage.querySelector('img').offsetHeight + 'px';
    };

    onHover = () => {
        if(this.props.chevronVisible === false) return;
        if(this.changeTimer) {
            clearInterval(this.changeTimer);
        }
    };

    mouseLeave = () => {
        if(this.props.chevronVisible === false) return;
        if(this.props.autoPlay) {
            this.changeImage('right');
            this.runAutoPlay();
        }
    };

    arrowClick = e => {
        if(e.target.classList.contains('left-arrow')) {
            this.changeImage('left');
        } else {
            this.changeImage('right');
        };
    };

    render() {
        const images = (
            <div ref="images" className={classnames({
                'images': true,
                'slide': this.props.slide
            })}>
                    {this.state.sliderImages.map((image, i) => {
                        return (
                            <div
                                className={classnames({
                                    'item-image': true,
                                    'show': this.state.chosenImage === i,
                                    'slide': this.props.slide,
                                    'fade': this.props.fade
                                })}
                                key={i}>
                                <img src={image} />
                            </div>
                        );
                    })}
            </div>
        );

        const loading = (
            <div className="loading">
                <Loader
                    color={this.props.loaderColor || 'white'}
                />
                <p>Loading...</p>
            </div>
        );

        return (
            <div className="Slider" onMouseEnter={this.onHover} onMouseLeave={this.mouseLeave}>
                {this.state.loading ?
                    loading :
                    images
                }
                {this.props.chevronVisible !== false &&
                    <div className="arrows">
                        <div className="left-arrow" onClick={this.arrowClick}>
                            {this.props.leftChevron ||
                            <LeftArrow
                                color={inlineStyles.fontColor}
                                style={{
                                    width: 50,
                                    height: 50,

                                }}
                            />
                            }
                        </div>
                        <div className="right-arrow" onClick={this.arrowClick}>
                            {this.props.righthevron ||
                            <RightArrow
                                color={inlineStyles.fontColor}
                                style={{
                                    width: 50,
                                    height: 50
                                }}
                            />
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
};

Slider.propTypes = {
    fetchImageRoute: PropTypes.string.isRequired,
    autoPlay: PropTypes.bool,
    chevronVisible: PropTypes.bool,
    loaderColor: PropTypes.string
};