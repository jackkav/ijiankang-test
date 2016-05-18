/**
 * Created on 5/17/16.
 */

BP3L.StasticIndex = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData(){


		let idInfoSub = Meteor.subscribe('bp3l.IDInfo');

		return {
				ready:idInfoSub.ready(),
				tests:DB.IDInfo.find().fetch()
		}

	},

	render(){

		if(!this.data.ready){
			return <div>loading</div>
		}
		return <div>

			<a href="/" >
				<RB.Button block>返回</RB.Button>
			</a>

			<RB.Well>StasticIndex</RB.Well>

			<RB.Table striped bordered condensed hover>
				<thead>
				<tr>
					<th>TestID</th>
					<th>testType</th>
					<th width="20%">Sessions</th>

					<th width="20%">DeviceInfo</th>

				</tr>
				</thead>
				<tbody>
				{
					this.data.tests.map(function(item){
						return <tr key={item._id}>
							<td><a href={"/statistic/"+item.testId+'?testType='+item.testType}>{item.testId}</a></td>
							<td>{item.testType}</td>
							<td><pre>{item.sessionIds && item.sessionIds.join("\n")}</pre></td>

							<td>

								{item.deviceInfo.manufacturer}
								-{item.deviceInfo.platform}
								-{item.deviceInfo.model}
								-{item.deviceInfo.version}
								-{item.deviceInfo.uuid}

							</td>
						</tr>
					})

				}
			</tbody>
		</RB.Table>





		</div>

	}

});
