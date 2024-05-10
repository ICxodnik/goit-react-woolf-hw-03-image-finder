import SearchBar from 'components/Searchbar';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import Error from 'components/Error';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import { Component } from 'react';
import { getItems } from 'services/api';

export class App extends Component {
  state = {
    page: 1,
    hasNextPage: false,
    query: '',
    images: [],
    isLoading: false,
    modalImage: null,
    apiError: '',
    appError: '',
  };

  componentDidCatch(error) {
    this.setState({ appError: error });
  }

  handleLoadMore = () => {
    this.setState(
      prevState => {
        return {
          isLoading: true,
          page: prevState.page + 1,
          hasNextPage: false,
          apiError: '',
          appError: '',
        };
      },
      () => {
        this.search();
      }
    );
  };

  handleQueryChange = value => {
    this.setState(
      {
        isLoading: true,
        query: value,
        page: 1,
        hasNextPage: false,
        apiError: '',
        appError: '',
      },
      () => {
        this.search(true);
      }
    );
  };

  search = async shouldClear => {
    try {
      const result = await getItems(this.state.query, this.state.page);

      this.setState(prevState => {
        return {
          images: shouldClear
            ? result.data
            : prevState.images.concat(result.data),
          hasNextPage: result.hasNextPage,
          isLoading: false,
        };
      });
    } catch (ex) {
      this.setState({ isLoading: false, apiError: ex });
    }
  };

  handleOpenModal = id => {
    const image = this.state.images.find(i => i.id === id);
    this.setState({
      modalImage: image,
    });
  };

  handleCloseModalImage = () => {
    this.setState({
      modalImage: null,
    });
  };

  handleCloseModalError = () => {
    this.setState({
      apiError: '',
      appError: '',
    });
  };

  render() {
    return (
      <div className="app">
        <Loader hide={!this.state.isLoading} />
        {this.state.modalImage && (
          <Modal
            modalImage={this.state.modalImage}
            onOverlayClick={this.handleCloseModalImage}
          />
        )}
        {this.state.appError && (
          <Error
            appError={this.state.appError}
            onOverlayClick={this.handleCloseModalError}
          />
        )}
        <SearchBar handleQueryChange={this.handleQueryChange} />
        <ImageGallery
          images={this.state.images}
          onSelected={this.handleOpenModal}
          apiError={this.state.apiError}
        />
        <Button
          title="Load more"
          handleLoadMore={this.handleLoadMore}
          hide={!this.state.hasNextPage}
        />
      </div>
    );
  }
}
