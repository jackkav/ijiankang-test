/**
 * Created on 5/11/16.
 */

FlowRouter.route('/', {
	action: function(params, queryParams) {
		console.log("Yeah! We are on the post:", params.postId);
		ReactLayout.render(App.AdminIndex)

	}
});

FlowRouter.route('/discovery', {
	action: function(params, queryParams) {
		ReactLayout.render(BP3L.Discovery)
	}
});



FlowRouter.route('/admin', {
	action: function(params, queryParams) {
		ReactLayout.render(App.AdminIndex)
	}
});
