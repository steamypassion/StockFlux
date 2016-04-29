/* global $ */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectStock, unselectStock, toggleFavourite } from '../../../actions/sidebar';
import favTabImage from '../../../assets/png/favourites_tab.png';
import Favourite from '../../../components/Favourite.js';

class Favourites extends Component {
    constructor(props) {
        super(props);
        this.onDrag = this.onDrag.bind(this);
        this.onClick = this.onClick.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
    }

    componentDidMount() {
        const scrollPadding = 'scroll-padding';
        const el = this.refs.scrollarea;
        $(this.refs.scrollarea).mCustomScrollbar({
            scrollInertia: 0,
            mouseWheel: {
                scrollAmount: 80
            },
            callbacks: {
                onOverflowY: () => {
                    $(el).addClass(scrollPadding);
                },
                onOverflowYNone: () => {
                    $(el).removeClass(scrollPadding);
                }
            }
        });
    }

    onClick(stockCode, stockName) {
        this.props.dispatch(selectStock(stockCode, stockName));
    }

    onDrag() {
        // TODO: send content to tearout
    }

    toggleFavourite(stockCode) {
        this.props.dispatch(toggleFavourite(stockCode));
        if (this.props.selection.code === stockCode) {
            this.props.dispatch(unselectStock());
        }
    }

    render() {
        const { favourites, hasErrors, isStarting, selection } = this.props;
        let bindings = {
            onClick: this.onClick,
            onIconClick: this.toggleFavourite,
            onDrag: this.onDrag
        };
        return (
            <div>
                <div className="sidetab-top">
                    <img src={favTabImage} className="top-icon" title="Favourites List" draggable="false" />
                </div>
                <div id="favourite-scroll" ref="scrollarea" className="side-scroll custom-scrollbar hiddenOnContracted">
                    <div className="sidetab">

                        {isStarting && <div className="no-favourites">
                            <p>Loading favourite stocks...</p>
                        </div>
                        }
                        {hasErrors && <div className="no-favourites errorWrapper">
                            An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
                        </div>
                        }
                        {!hasErrors && favourites.length === 0 && <div className="no-favourites">
                            <p>You have no favourites to display.</p>
                            <p>Use the search tab to add new stocks to the list.</p>
                        </div>
                        }
                        {favourites && favourites.length > 0 && (favourites || []).map(stockCode =>
                            <Favourite key={stockCode} stockCode={stockCode} bindings={bindings} selected={stockCode === selection.code} isFavourite={favourites.indexOf(stockCode) >= 0} />)}
                    </div>
                </div>
            </div>
        );
    }
}
Favourites.propTypes = {
    selection: PropTypes.object,
    favourites: PropTypes.array,
    hasErrors: PropTypes.bool,
    isStarting: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { favourites, selection } = state;
    // TODO: create logic for 'isStarting
    return { favourites, selection, isStarting: false, hasErrors: false };
}
export default connect(mapStateToProps)(Favourites);