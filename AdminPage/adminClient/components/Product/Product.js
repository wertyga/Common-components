import emptyImage from '../../../server/common/EmptyImage.png';

import { Image, Segment } from 'semantic-ui-react';

import './Product.sass';

export default class Product extends React.Component {
    constructor(props) {
        super(props);
    };

    editProduct = data => {
        this.props.editProduct({...this.props})
    };

    render() {

        const discount = (
            <div className="wrapper"></div>
        );

        return (
            <Segment className="Product" onClick={this.editProduct}>
                <div className="left-block">

                    <div className="image">
                        {this.props.discount && (
                            <div className="discount">
                                {discount}
                                <p>{`${this.props.discount.slice(0,2)}%`}</p>
                            </div>
                        )}

                        <Image src={this.props.filePath || emptyImage} alt={this.props.title || 'No image'}/>
                    </div>

                </div>

                <div className="right-block">
                    <div className="category">Category: {this.props.categoryName}</div>
                    <h3>{this.props.title || 'No title'}</h3>
                    <p>{this.props.description || 'No description'}</p>
                    <p className="price">Цена: {!this.props.price ? 'No price' : `${this.props.price} руб.`}</p>
                </div>
            </Segment>
        );
    };
};