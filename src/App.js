import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Container from './components/Container/Container';
import { requestImages } from './services/requestImages';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import Great from 'components/ImageGallery/Great';
import Modal from './components/Modal/Modal';

export default class App extends Component {
  state = {
    gallery: [],
    isLoading: false,
    query: '',
    page: 1,
    modal: { show: false, alt: '', src: '' },
    dataLength: 0,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handlerEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlerEsc);
  }

  componentDidUpdate() {
    if (this.state.isLoading)
      requestImages({
        querry: this.state.query,
        page: this.state.page,
      })
        .then(response => {
          if (response.data.hits.length === 0) {
            toast.error(`По запросу ${this.state.query} ничего не найдено`);
            this.setState({
              isLoading: false,
              query: '',
              dataLength: response.data.hits.length,
            });
          } else {
            this.updateGallery(response);
            this.setState({ dataLength: response.data.hits.length });
          }
        })
        .catch(error => {
          if (error) {
            return toast.error(`Что-то пошло не так, попробуйте позже`);
          }
        })
        .finally(() => this.setState({ isLoading: false }));
  }

  onSubmitForm = query => {
    if (query === this.state.query || query === '')
      return toast.warning('Введите запрос');
    this.setState({
      isLoading: true,
      query,
      page: 1,
      gallery: [],
    });
  };

  updateGallery = response => {
    this.setState(
      prevState => ({
        gallery: [...prevState.gallery, ...response.data.hits],
        isLoading: false,
      }),
      this.scroll,
    );
  };

  scroll = () => {
    if (this.state.page !== 1)
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
  };

  loadMore = () => {
    if (this.state.dataLength === 0)
      return toast.error(
        'По данному запросу боьше ничено нет, введите новый запрос.',
      );
    this.setState(prevState => ({
      isLoading: true,
      page: prevState.page + 1,
    }));
  };

  openModal = (src = '', alt = '') => {
    this.setState(prevState => ({
      modal: {
        show: !prevState.modal.show,
        alt,
        src,
      },
    }));
  };

  handlerEsc = e => {
    if (e.key === 'Escape' && this.state.modal.show) this.openModal();
  };

  render() {
    const { isLoading, gallery, modal } = this.state;

    return (
      <Container>
        <Searchbar onSubmit={this.onSubmitForm} />

        {isLoading && <Loader />}

        {gallery.length > 0 ? (
          <ImageGallery
            gallery={gallery}
            openModal={this.openModal}
            loadMore={this.loadMore}
          />
        ) : (
          <Great />
        )}

        {modal.show && (
          <Modal src={modal.src} alt={modal.alt} openModal={this.openModal} />
        )}

        <ToastContainer />
      </Container>
    );
  }
}
