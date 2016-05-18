/**
 * Created on 5/17/16.
 */


FlowRouter.route('/statistic', {
	action: function(params, queryParams) {
		ReactLayout.render(BP3L.StasticIndex)
	}
});
FlowRouter.route('/statistic/:testId', {
	action: function(params, queryParams) {
		ReactLayout.render(BP3L.StatisticTestDetail,{testId: params.testId, testType:queryParams.testType})
	}
});