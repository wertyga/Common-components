import { connect } from 'react-redux';
import axios from 'axios';

import { fetchCategory } from '../../actions/products';

import { Button, Dropdown, Loader } from 'semantic-ui-react';

import loadFunc from '../common/commonFunctions/loading';
import clearError from '../common/commonFunctions/clearError';

import Product from '../Product/Product';
import ModalProduct from '../ModalProduct/ModalProduct';

import './AdminPage.sass';



function mapStateToProps(state) {
    return {
        globalError: state.globalError,
        products: state.products
    }
};

@connect(mapStateToProps, { fetchCategory })

export default class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.loadFunc = loadFunc.bind(this);
        this.clearError = clearError.bind(this);
        this.initialState = {
            showModal: false,
            modal: {
                title: '',
                description: '',
                image: '',
                price: '',
                discount: '',
                category: '',
                productId: ''
            },
            categories: [],
            chosenCategory: '',
            products: this.props.products,
            loading: false,
            loadingCats: false,
            errors: {}
        }

        this.state = this.initialState;
    };

    async componentDidMount() {
        this.setState({
            loadingCats: true
        });
        this.selectChange(false, { value: 'all' });
        axios.get('/admin/fetch-categories')
            .then(res => this.setState({
                categories: res.data.categories.map((item, i) => { return { key: i, value: item.value, text: item.title } }),
                loadingCats: false
            }))
            .catch(err => {
                this.setState({
                    loadingCats: false
                });
                this.props.globalError = err.message
            })
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.products !== prevProps.products) {
            if(this.state.chosenCategory) {
                if(this.state.chosenCategory !== 'all') {
                    this.setState({
                        products: this.props.products.filter(item => item.category === this.state.chosenCategory)
                    })
                } else {
                    this.setState({
                        products: this.props.products
                    })
                }
            }

        };

        if(this.props.globalError !== prevProps.globalError) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    globalError: this.props.globalError
                }
            });
        };

        if(this.state.chosenCategory !== prevState.chosenCategory) {
            this.setState({ loading: true });
            this.props.fetchCategory(this.state.chosenCategory)
                .then(() => this.setState({ loading: false }))
                .catch(() =>  this.setState({ loading: false }))
        }
    };

    selectChange = (e, data) => {
        const value = data.value;
        this.setState({
            chosenCategory: value
        });
    };

    addProduct() {
        this.setState({
            showModal: true,
            modal: this.initialState.modal
        });
    };

    editProduct = data => {
        const { title, description, filePath, price, discount, _id, category } = data;
        this.setState({
            showModal: true,
            modal: {
                productId: _id,
                title,
                description,
                image: filePath,
                price,
                discount,
                category
            },
        });
    };

    render() {

        const loading = (
            <div className="loading">
                <Loader active>Loading...</Loader>
            </div>
        );

        return (
            <div className="Admin">
                <h1>Admin page</h1>
                {this.state.errors.globalError && <div name="globalError" className="global-error" onClick={this.clearError}>{this.state.errors.globalError}</div>}
                <div className="header">
                    <ModalProduct
                        onClose={() => this.setState({ showModal: false })}
                        showModal={this.state.showModal}
                        onClick={this.addProduct.bind(this)}
                        categories={this.state.categories}
                        {...this.state.modal}
                    />

                    <Dropdown
                        placeholder='--Categories--'
                        options={this.state.categories}
                        onChange={this.selectChange}
                        loading={this.state.loadingCats}
                        className="select"
                        disabled={this.state.loadingCats}
                        value={this.state.chosenCategory}
                    />
                </div>

                <div className="content">
                    {this.state.loading ? loading :
                        (
                            this.state.products.length < 1 ?
                                <div className="empty-products">No items...</div> :
                                this.state.products.map((item, i) => {
                                    return (
                                        <Product
                                            key={i}
                                            editProduct={this.editProduct}
                                            {...item}
                                            categoryName={this.state.categories.find(cat => cat.value === item.category).text}
                                        />
                                    )
                                })
                        )
                    }
                </div>
            </div>
        );
    }
}