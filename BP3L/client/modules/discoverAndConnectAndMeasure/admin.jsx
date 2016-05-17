/**
 * Created  on 5/17/16.
 */


BP3L.DiscoverAndConnectAndMeasureAdminPage = React.createClass({
	mixins: [ReactMeteorData],


	getMeteorData(){

		let sub = Meteor.subscribe('DiscoverAndConnectAndMeasureTest')

		return {
			ready:sub.ready(),
			tests: DB.DiscoverAndConnectAndMeasureTest.find().fetch()
		}

	},

	render(){

		if(!this.data.ready){
			return <div>loading</div>
		}

		const tableInstance = (
			<RB.Table striped bordered condensed hover>
				<thead>
				<tr>
					<th>TestID</th>
					<th>sessionId</th>
					<th>id</th>
					<th>macId</th>
					<th>result</th>
				</tr>
				</thead>

				<tbody>

				{
					this.data.tests.map(function (item) {
						return <tr key={item._id}>
							<td>{item.deviceInfo.manufacturer+'_'+item.deviceInfo.version +item.deviceInfo.serial}</td>
							<td>{item.sessionId}</td>
							<td>{item._id}</td>
							<td>{item.macId}</td>
							<td>{
								(item.runResult && item.runResult.type)
								|| (item.result && item.result.type)
							}</td>


						</tr>
					})
				}


				</tbody>
			</RB.Table>
		);

		var tests = _.groupBy(_.pluck(this.data.tests, 'testId'));

		console.log(tests)


		return <div style={{padding:10}}>


			<div>
				DiscoverAndConnectAndMeasureAdminPage Result
			</div>

			{ _.pluck(this.data.tests, 'testId') }



			{tableInstance}


		</div>
	}

})