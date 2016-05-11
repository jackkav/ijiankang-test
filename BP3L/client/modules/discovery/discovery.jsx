/**
 * Created  on 5/11/16.
 */

BP3L.Discovery = React.createClass({

	discovery(){
		alert('discovery')
	},
	render() {
		return <div>

			<h1>Hello, {this.props.name}</h1>

			<button onClick={this.discovery}>discovery</button>

			<RB.Button bsStyle="primary">Primary</RB.Button>

		</div>
	}
});