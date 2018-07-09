import React, { Component } from 'react'
import Main from '../templates/Main'
import axios from 'axios'


const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar, Excluir' 
}
const baseUrl = 'http://localhost:3001/users'

const initialState = {
    user: {name: '', email: ''},
    list: []
}

export default class UserCrud extends Component {
    state = { ...initialState }
    

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({list: resp.data})
        })
    }
    clear() {
        this.setState({user: initialState.user})    
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'

        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user).then(resp => {
             const list = this.GetUpdatedList(resp.data)
             this.setState({user: initialState.user, list})
        })
    }

    load(user) {
        this.setState({user})
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.GetUpdatedList(user,false)
            
            this.setState({list})
        })
    }

    GetUpdatedList(user, add = true) {
        
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    UpdateField(event) {
        const  user = {...this.state.user}

        user[event.target.name]= event.target.value
        this.setState({ user })
    }
    
    RenderTable() {
        return(
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>name</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {this.RenderRows()}
                </tbody>
            </table>
        )
    }

    RenderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" 
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"/>
                        </button>

                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"/> 
                        </button>
                    </td>
                </tr>
            )
        })
    }

    RenderForm() {
        return(
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md6">
                        <div className="form-group">
                            <label>name</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.UpdateField(e)}
                                placeholder="Digite o name"/>
                        </div>
                    </div>
                     
                    <div className="col-12 col-md6">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.UpdateField(e)}
                                placeholder="Digite o email"/>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    render() {
        return(
            <Main {...headerProps}>
                {this.RenderForm()}
                {this.RenderTable()}
            </Main>
        )
    }
}
