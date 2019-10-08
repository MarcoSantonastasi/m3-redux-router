import React from 'react';
import SimpleAsset from './components/SimpleAsset'
import mongoose from 'mongoose';



interface IProps{}
export interface IAssetData{
    _id:string;
    asset_name:string;
    asset_value:number;
}

interface IState {
    assets: JSX.Element[];
  }

export default class App extends React.PureComponent<IProps, IState> {

  constructor(props:any) {
    console.log("new App component will be initialized");
    super(props);

    this.handleCreateAsset = this.handleCreateAsset.bind(this);
    this.handleDeleteAsset = this.handleDeleteAsset.bind(this);

    const exampleAsset = {
        _id: mongoose.Types.ObjectId().toString(),
        asset_name: "This is an example, press Edit to change name and Value",
        asset_value: 0
      }

    this.state = {
        assets: [exampleAsset].map(asset => <SimpleAsset key={asset._id} onDelete={this.handleDeleteAsset} asset={asset} edit={false} />)
    }
  }
  render() {
    return (
      <div>
        <h1>simple asset management application</h1>
        <p>to create a new asset click this button:&nbsp;
          <button onClick={this.handleCreateAsset}>create asset</button>
        </p>
        <table>
          <tbody>
            <tr><th>description</th><th>value</th><th>action</th></tr>
            {this.state.assets}
            
          </tbody>
        </table>
      </div>
    );
  }
  handleCreateAsset() {
    console.log("handleCreateAsset invoked");
    const newAsset:IAssetData = {
      _id: mongoose.Types.ObjectId().toString(),
      asset_name: "",
      asset_value: 0
    }
    let newAssets = this.state.assets.slice();

    newAssets.push(<SimpleAsset key={newAsset._id} onDelete={this.handleDeleteAsset} edit={true} asset={newAsset} />);

    this.setState(
      {
        assets: newAssets
      }
    );
    console.log(newAsset);
  }


  handleDeleteAsset(event:any) {
    const IdOfAssetToDelete = event.target.id;
    console.log("Delete asset with _id:" + IdOfAssetToDelete);

    let newAssets = this.state.assets.filter(asset => {
      console.log("asset.key:" + asset.key + " IdOfAssetToDelete:" + IdOfAssetToDelete + " " + (asset.key !== IdOfAssetToDelete));
      return asset.key !== IdOfAssetToDelete;
    })
    this.setState(
      {
        assets: newAssets
      }
    );
  }

}
