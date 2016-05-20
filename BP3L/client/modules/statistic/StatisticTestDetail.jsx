
/**
 * Created on 5/18/16.
 */

BP3L.StatisticTestDetail = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData(){
		let testData

		if(this.props.testType=='DiscoverAndConnectAndMeasureTest'){
			testData = Meteor.subscribe('DiscoverAndConnectAndMeasureTest')

			return {
				ready:testData.ready(),
				list:DB.DiscoverAndConnectAndMeasureTest.find({testId:this.props.testId}).fetch()
			}
		}else {

			testData = Meteor.subscribe('bp3l.SLDtest')

			return {
				ready:testData.ready(),
				list:DB.SLDtest.find({testId:this.props.testId}).fetch()
			}

		}

	},

	getSessions(list){
		let ids = _.pluck(list,'sessionId')

		ids = _.uniq(ids)

		return ids

	},
	isSuccess(){

	},

	getSessionResult(sessionId, list){
		let result ={
			sum:0,
			success:0,
			failure:0
		}
		let sessions = _.filter(list,function(item){
				return item.sessionId ==sessionId
		})

		_.each(sessions,function(item){
			if((item.runResult && item.runResult.type=='success') || item.status=='success'){
				result.success++
			}else{
				result.failure++
			}
		})
		result.sum = result.success + result.failure

		return result

	},

	analyzeData(list){
		let self = this

		let sessionsIds  = this.getSessions(list)

		let sessionMap ={}


		_.each(list,function(item){
			sessionMap[item.sessionId]= sessionMap[item.sessionId] || []
			sessionMap[item.sessionId].push(item)
		})

		let sessionStat={}

		_.each(sessionsIds,function(id){
			sessionStat[id] = self.getSessionResult(id,sessionMap[id])
		})


		return {
			ids:sessionsIds,
			map:sessionMap,
			stat:sessionStat
		}

	},

	render(){

		if(!this.data.ready){
			return <div>loading</div>
		}

		let sessionIds = this.getSessions(this.data.list)

		let analyzeData =  this.analyzeData(this.data.list)

		debugger

		return <div>
			<a href="/statistic" >
				<RB.Button block>返回</RB.Button>
			</a>

			<div>

				<RB.Well>TEST_ID:{this.props.testId}</RB.Well>



			</div>

			<hr/>

			<RB.Table striped bordered condensed hover>
				<thead>
				<tr>
					<th>sessionId</th>
					<th>successCount</th>
					<th >failureCount</th>
					<th >sumCount</th>
				</tr>
				</thead>

				<tbody>
				{
					analyzeData.ids.map(function(id){
						debugger
						return <tr>
							<td>{id}</td>
							<td>{analyzeData.stat[id].success}</td>
							<td>{analyzeData.stat[id].failure}</td>
							<td>{analyzeData.stat[id].sum}</td>

						</tr>
					})
				}

				</tbody>
			</RB.Table>



			<hr/>

			时间统计

			<RB.Table striped bordered condensed hover>
				<thead>
				<tr>
					<th>sessionId</th>
					<th>testId</th>
					<th >connect1 time</th>
					<th >connect1-status</th>

					<th >connect2 time</th>
					<th >connect2-status</th>

				</tr>
				</thead>

				<tbody>
				{
					this.data.list.map(function(item){
						debugger
						return <tr key={item._id}>
							<td>{item.sessionId}</td>
							<td>{item._id}</td>
							<td>
								{
									(item.timeData.connectSuccessTime_1
									|| item.timeData.connectFailureTime_1 || item.timeData.connectFailTime_1
									|| item.timeData.connectErrorTime_1) - item.timeData.connectStartTime_1
								}

							</td>
							<td>{
								item.timeData.connectSuccessTime_1
									?'success'
									:(item.timeData.connectFailureTime_1 ||item.timeData.connectFailTime_1)?'failure':
										item.timeData.connectErrorTime_1?'error':
											item.timeData.connectTimeout_1?'timeout':''

							}</td>

							<td>
								{
									!item.timeData.connectStartTime_2?'':
										(
										(item.timeData.connectSuccessTime_2
											|| item.timeData.connectFailureTime_2
											|| item.timeData.connectErrorTime_2) - item.timeData.connectStartTime_2
										)
								}

							</td>
							<td>{
								item.timeData.connectSuccessTime_2
									?'success'
									:item.timeData.connectFailureTime_2?'failure':
									item.timeData.connectErrorTime_2?'error':
										item.timeData.connectTimeout_2?'timeout':''

							}</td>

						</tr>
					})
				}

				</tbody>
			</RB.Table>


			{
				//this.data.list.map(function(item){
				//	return <div key={item._id}> {item._id} </div>
				//})
			}

		</div>
	}

})