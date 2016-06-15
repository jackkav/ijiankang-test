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


FlowRouter.route('/statistic/TempAnalize1', {
	action: function(params, queryParams) {

		ReactLayout.render(BP3L.TempAnalize1)
	}
});



//////////test_v2///////


FlowRouter.route('/statistic/test_v2/index', {
	action: function(params, queryParams) {

		//ReactLayout.render(BP3L.StatisticTestV2Index)
		ReactLayout.render(BP3L.StatisticTestV2Analysis_1)

	}
});
FlowRouter.route('/statistic/test_v2/analysis_1', {
	action: function(params, queryParams) {

		ReactLayout.render(BP3L.StatisticTestV2Analysis_1)
	}
});

FlowRouter.route('/statistic/test_v2/connectTime', {
	action: function(params, queryParams) {

		ReactLayout.render(BP3L.StatisticTestV2ConnectTime)
	}
});

FlowRouter.route('/statistic/test_v2/modelComparison', {
	action: function(params, queryParams) {

		ReactLayout.render(BP3L.StatisticTestV2ModelComparison)
	}
});
