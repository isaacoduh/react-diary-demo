import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

class Form extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: '',
            body: '',
            author: '',
        }

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.entryToEdit){
            this.setState({
                title: nextProps.entryToEdit.title,
                body: nextProps.entryToEdit.body,
                author: nextProps.entryToEdit.author,
            });
        }
    }
    handleSubmit(){
        const { onSubmit, entryToEdit, onEdit } = this.props;
        const {title, body, author} = this.state;

        if(!entryToEdit){
            return axios.post('http://localhost:8000/api/entries', {
                title,
                body,
                author
            }).then((res) => onSubmit(res.data))
            .then(() => this.setState({title: '', body: '', author: ''}));
        } else {
            return axios.put(`http://localhost:8000/api/entries/${entryToEdit._id}`, {
                title,
                body,
                author
            })
            .then((res) => onEdit(res.data))
            .then(() => this.setState({title: '', body: '', author: ''}));
        }

        
    }

    handleChangeField(key, event){
        this.setState({
            [key]: event.target.value,
        });
    }

    render(){
        const {entryToEdit} = this.props;
        const {title, body, author}  = this.state;

        return (
            <div className="col-12 col-lg-6 offset-lg-3">
                <input
                onChange={(ev) => this.handleChangeField('title', ev)}
                value={title}
                className="form-control my-3" 
                placeholder="Entry Title" />
                <textarea
                onChange={(ev) => this.handleChangeField('body', ev)}
                className="form-control my-3"
                placeholder="Article Body"
                value={body}></textarea>
                <input 
                    onChange={(ev) => this.handleChangeField('author', ev)}
                    value={author}
                    className="form-control my-3"
                    placeholder="Entry Author"
                />
                <button onClick={this.handleSubmit} className="btn btn-primary float-right">{entryToEdit ? 'Update' : 'Submit'}</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: data => dispatch({type: 'SUBMIT_ENTRY', data}),
    onEdit: data => dispatch({type: 'EDIT_ENTRY', data}),
});

const mapStateToProps = state => ({
    entryToEdit: state.home.entryToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);