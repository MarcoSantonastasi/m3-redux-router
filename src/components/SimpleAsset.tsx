import React from 'react';
import { IAssetData } from '../App';
import mongoose from 'mongoose';
import { ActionType } from '../framework/IAction';
import { ICreateAsset } from '../App';

import { IWindow } from '../framework/IWindow';
declare let window: IWindow;

//this file defines the React component that renders a single asset to the browser window
//it also contains the logic to change asset properties and save the changes to the database
//most of the used React framework features are already explained in the comments of App.js
//so this code hopefully mostly explains itself ...

interface IProps {
    onDelete: Function;
    edit: boolean;
    asset: IAssetData;
}


interface IState {
    delete_function: any;
    edit_mode: boolean;
    asset: IAssetData;
    counter:number;
}

export default class SimpleAsset extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.handleEdit = this.handleEdit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleRerenderTest = this.handleRerenderTest.bind(this);

        //one new thing is, that the state will be initialized by properties that are set when the component is created in the container element:
        //look for "<SimpleAsset key={newAsset._id} onDelete={this.handleDeleteAsset} edit={true} asset={newAsset} />" in App.js
        this.state = {
            delete_function: props.onDelete,
            edit_mode: props.edit,
            asset: props.asset,
            counter:0
        }
    }

    render() {

        //if the component is in edit mode, it will render different than if it just shows the data

        if (this.state.edit_mode)
            return (
                <tr>
                    <td><input type="text" name="name" value={this.state.asset.asset_name} onChange={this.handleNameChange} /></td>
                    <td><input type="number" name="value" value={this.state.asset.asset_value} onChange={this.handleValueChange} /> €</td>
                    <td>
                        <button onClick={this.handleSave} id={this.state.asset._id}>save</button>
                        <button onClick={this.handleRerenderTest} >increase State Counter</button>
                    </td>
                </tr>
            )
        else
            return (
                <tr>
                    <td>{this.state.asset.asset_name}</td>
                    <td>{this.state.asset.asset_value} €</td>
                    <td>
                        <button onClick={this.handleEdit}>edit</button>
                        <button onClick={this.state.delete_function} id={this.state.asset._id}>sell or dispose</button>
                        <button onClick={this.handleRerenderTest} >increase State Counter {window.CS.getUIState().counter}</button>
                    </td>
                </tr>
            )
    }

    handleNameChange(event: any) {
        const newAsset = {
            _id: this.state.asset._id,
            asset_name: event.target.value,
            asset_value: this.state.asset.asset_value
        }
        const newState: IState = {
            delete_function: this.state.delete_function,
            edit_mode: this.state.edit_mode,
            asset: newAsset,
            counter:0
        }
        this.setState(newState);
    }

    handleValueChange(event: any) {
        this.setState({
            asset: {
                _id: this.state.asset._id,
                asset_name: this.state.asset.asset_name,
                asset_value: event.target.value
            }
        });
    }

    handleSave(event: any) {
        this.setState({ edit_mode: false });
    }
    handleEdit() {
        this.setState({ edit_mode: true });
    }
    handleRerenderTest(event: any) {
        const newAsset: IAssetData = {
            _id: mongoose.Types.ObjectId().toString(),
            asset_name: "",
            asset_value: 0
        }
        const action: ICreateAsset = {
            type: ActionType.create_asset,
            asset: newAsset
        }
        window.CS.clientAction(action);
    }
}