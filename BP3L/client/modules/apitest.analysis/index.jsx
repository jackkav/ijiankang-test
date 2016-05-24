/**
 * Created on 5/17/16.
 */

BP3L.Analysis = React.createClass({

  getInitialState() {
    return {
      testId: '',
      counts: {}
    }
  },

  handleChange: function(newValue) {
    // When user delete the type-in value
    if( newValue === '') {
      this.setState({testId: null});
    }

    this.setState({testId: newValue});

  },

  analysis() {
    Meteor.call('apitest.analysis', this.state.testId, (err, counts)=>{
      this.setState({counts: counts})
    });
  },

	render(){

    let valueLink = {
      value: this.state.testId,
      requestChange: this.handleChange
    }

    let marginLeft = {
      marginLeft: '20px'
    }

		return <div>

			<a href="/" >
				<RB.Button block>返回</RB.Button>
			</a>

			<input valueLink={ valueLink } placeholder='输入testId'></input>

      <RB.Button block onClick={this.analysis}>Searching</RB.Button>

      <div>
        <label>总次数</label>
        <span style={marginLeft}>{this.state.counts.allCount || 0}</span>
      </div>
      <div>
        <label>第一次搜索失败</label>
        <span style={marginLeft}>{this.state.counts.firstDiscoveryCount || 0}</span>
      </div>
      <div>
        <label>第二次搜索失败</label>
        <span style={marginLeft}>{this.state.counts.secondDiscoveryCount || 0}</span>
      </div>
      <div>
        <label>第一次连接失败</label>
        <span style={marginLeft}>{this.state.counts.firstConnectCount || 0}</span>
      </div>
      <div>
        <label>第二次连接失败</label>
        <span style={marginLeft}>{this.state.counts.secondConnectCount || 0}</span>
      </div>

      <div>
        <label>失败次数</label>
        <span style={marginLeft}>{this.state.counts && (this.state.counts.secondConnectCount + this.state.counts.secondDiscoveryCount) || 0}</span>
      </div>


		</div>

	}

});
