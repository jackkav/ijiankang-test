/**
 * Created on 5/17/16.
 */

FlowRouter.route('/statistic', {
	action: function(params, queryParams) {
		ReactLayout.render(BP3L.StasticIndex)
	}
});
FlowRouter.route('/statistic/detail/:testId', {
	action: function(params, queryParams) {
		ReactLayout.render(BP3L.StatisticTestDetail,{testId: params.testId, testType:queryParams.testType})
	}
});

FlowRouter.route('/statistic/StatisticTestV2', {
	action: function(params, queryParams) {

		ReactLayout.render(BP3L.StatisticTestV2)
	}
});

FlowRouter.route('/statistic/TempAnalize1', {
	action: function(params, queryParams) {

		ReactLayout.render(BP3L.TempAnalize1)
	}
});
