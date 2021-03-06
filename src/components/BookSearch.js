import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as Books from './../tools/BooksAPI'
import Book from './Book'
import { toast } from 'react-toastify';

class BookSearch extends Component {

    state = {
        results: [],
        term: null
    }

    constructor(props) {
        super(props)
        this.onChangeTerm = this.onChangeTerm.bind(this)
        this.onChangeShelf = this.onChangeShelf.bind(this)
    }

    onChangeTerm(event) {
        const term = event.target.value
        if (term.length > 2) {
            this.search(term)
        }
    }

    onChangeShelf(book, shelf, callback) {
        Books.update(book, shelf).then(res => {
            this.search(this.state.term)
            callback()
            toast.success(`Book added to shelf '${shelf}'`)
        })
    }

    search(term) {
        Books.getAll().then(userBooks => {
            //Minha versão inicial, comentada, filtrava os livros de estantes dos resultados da busca
            //const ignoredIds = userBooks.map(book => book.id)
            Books.search(term, 20).then(
                response => {
                    const results = !response.error 
                        ? response
                            //.filter(book => !ignoredIds.includes(book.id))
                            //.map(book => Object.assign({}, book, { shelf: 'none' }))
                            .map(book => Object.assign({}, book, { shelf: 
                                userBooks
                                    .filter(b => b.id === book.id)
                                    .reduce((acc, b) => b.shelf, 'none')
                            }))
                        : []
                    this.setState({results, term})
                }
            )
        })
    }

    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to="/" className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author" onChange={this.onChangeTerm} />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.results.map(book =>
                            <Book key={book.id} book={book} onShelfChange={this.onChangeShelf} />
                        )}
                    </ol>
                </div>
            </div>
        )
    }

}

export default BookSearch