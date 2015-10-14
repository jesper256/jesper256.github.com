var Budget = function () {
	
	var viewModel = {
		income: ko.observable(1000),		
		spendings: ko.observableArray([]),
		categorys: ko.observableArray([]),		
	};	
	
	viewModel.totalSpendings = ko.computed(function(){
		var items = viewModel.spendings();
		var total=0;
		for (var i = 0; viewModel.categorys().length != i; i++) {
		    var spendings = viewModel.categorys()[i].Spendings();
		    for (var s = 0; spendings.length != s; s++) {
		        total += parseFloat(spendings[s].Amount);
		    }
		}
		return total;
	});
        	
	ko.applyBindings(viewModel, document.getElementById('container'));

	return viewModel;
};

var Item = {};
var Helper = {
    GenerateId: function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};

Item.Category = function (name) {
    this.Id = Helper.GenerateId();
    this.Name = name,
    this.Amount = ko.observable(""),
    this.AddSpending = function (category) {
        
        var amount = parseFloat(category.Amount()).toFixed(2);

        if (isNaN(amount)) return;

        category.Spendings.push(new Item.Spending(name, amount, category.Id));
        category.Amount("");
    },
    this.Width = ko.computed(function () {        
        return (100 / budget.categorys().length) + "%";
    }),
    this.Spendings = ko.observableArray([])    
};


Item.Spending = function (type, amount, parentId) {
    this.Id = Helper.GenerateId();
    this.ParentId = parentId;
    this.Type = type,
    this.Amount = parseFloat(amount).toFixed(2),
    this.Remove = function (spending) {
       
        ko.utils.arrayForEach(budget.categorys(), function (category) {
            if (category.Id === spending.ParentId)
                category.Spendings.remove(function (item) { return item.Id === spending.Id })
        });
    }
};