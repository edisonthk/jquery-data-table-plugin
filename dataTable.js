function DataTable (ele, options){
	this.ns_cell 	= options.ns_cell;
	this.data 		= options.data;
	this.tools		= options.tools;

	if(typeof ele == "jquery"){
		this._ele	= ele;
	}else{
		this._ele	= $(ele)[0];		
	}

	if(typeof options.onDataChanged == "undefined"){
		this.onDataChanged = function(event, cellsChanged)
		{
			console.log("data changed, length:" +cellsChanged.length );
		}
	}else{
		this.onDataChanged = options.onDataChanged;
	}
	this.onEditFlag = false;
	this.init();
};

DataTable.prototype.init = function()
{
	// build html with data
	this.buildHTMLWithData(this.data);


	// init every cells with special id
	for(var i = 0; i < this._ele.rows.length ; i++)
	{
		var row = this._ele.rows[i];
		for(var j = 0; j < row.cells.length; j++)
		{
			var cell = row.cells[j];
			cell.id = this.ns_cell + "_" + i + "_" + j;			
		}
	}
	

	// init event for cells
	var _this = this;
	_this.allCells().click(function(e){
		_this.clickEvent(this);
	});	
	_this.allCells().each(function(index , element){
		$(element).find("input").focus(function(e){
			_this.focusEvent(this);
		});
		$(element).find("input").blur(function(e){
			_this.blurEvent(this);
		});
		$(element).find("input").keyup(function(e){
			_this.keyupEvent(this ,e);
		});
		$(element).hover(
				_this.hoverInEvent,
				_this.hoverOutEvent
			);
		$(element).find(".btn-edit").click(function(e){
			_this.onClickEditButtonEvent(this);
		});
		$(element).find(".btn-remove").hover(
				function(e){_this.hoverInRemoveButtonEvent(this)},
				function(e){_this.hoverOutRemoveButtonEvent(this)}
				
			);
		$(element).find(".btn-remove").click(function(e){
			_this.onClickRemoveButtonEvent(this);
		});
		$(element).find(".btn-no").click(function(e){
			console.log("clickedddd");
		});
	});

}
DataTable.prototype.onClickRemoveButtonEvent = function(ele)
{
	var position = this.getCellIndex($(ele).parent().parent());
	if(position.col == 0){
		var row = position.row;
		this.deleteRow(row);
	}else{
		var col = position.col;
		this.deleteColumn(col);
	}
}
DataTable.prototype.hoverInRemoveButtonEvent = function(ele)
{
	var position = this.getCellIndex($(ele).parent().parent());
	if(position.col == 0){
		// add class .remove-range to cells in row
		for(var i = 0; i < this.colLength(); i++)
		{
			var _c = this.cell( position.row , i);
			if(!(_c instanceof jQuery)){
				_c = $(_c);
			}
			_c.addClass("remove-range");
		}
	}else{
		// add class .remove-range to cells in col
		for(var i = 0; i < this.rowLength(); i++)
		{
			var _c = this.cell( i, position.col);
			if(!(_c instanceof jQuery)){
				_c = $(_c);
			}
			_c.addClass("remove-range");
		}
	}
}

DataTable.prototype.hoverOutRemoveButtonEvent = function(ele)
{
	this.allCells().each(function(index,element){
		$(element).removeClass("remove-range");
	});	
}
DataTable.prototype.hoverOutEvent = function()
{
	$(this).find(".tools").addClass("hidden");	
}
DataTable.prototype.hoverInEvent = function()
{
	if($(this).find(".edit-tools:visible").length <= 0){
		$(this).find(".tools").removeClass("hidden");	
	}
}
DataTable.prototype.buildHTMLWithData = function(data)
{
	var table = this._ele;
	table.innerHTML = "";

	for(var r = 0 ;r < data.length ; r++)
	{
		var row = table.insertRow(r);

		for(var c = 0; c < data[r].length ; c++)
		{
			var cell = row.insertCell(c);
			var _s = "<span>"+data[r][c]+"</span>";
			var _i = "<input class='hidden' type='text'>";
			var _it = "<div class='edit-tools hidden'><button class='btn btn-ok'><i class='fa fa-check'></i></button></div>"



			var _toolsInHTML = "";
			try{

				var _tools = this.tools[r][c].split(",");
				for(var k = 0 ; k < _tools.length; k ++)
				{
					if(_tools[k] == ""){
						// dummy
					}else if(_tools[k] == "btn-remove"){
						_toolsInHTML += "<button class='btn "+_tools[k]+"'><i class='fa fa-trash-o'></i></button>";
					}else if(_tools[k] == "btn-edit"){
						_toolsInHTML += "<button class='btn "+_tools[k]+"'><i class='fa fa-pencil'></i></button>";
					}else{
						_toolsInHTML += "<button class='btn "+_tools[k]+"'>"+_tools[k]+"</button>";	
					}
					
				}

			}catch(err){
				_toolsInHTML += "";
			}
			

			var _sideGroup = "<div class='tools hidden'>"+_toolsInHTML+"</div>";

			cell.innerHTML = _s + _i + _it + _sideGroup;
		}
	}
}
DataTable.prototype.colLength = function()
{
	return this.data[0].length;
}
DataTable.prototype.rowLength = function()
{
	return this.data.length;
}
DataTable.prototype.focusEvent = function(ele)
{
	this.dataBeforeChanged = $(ele).val();
}
DataTable.prototype.onClickEditButtonEvent = function(clickedElement)
{
	this.allCells().each(function(index,element){
		$(element).find("span").removeClass("hidden");
		$(element).find("input").addClass("hidden");
	});	
	var clickedSpan = $(clickedElement).parent().parent().find("span");
	var clickedInput = $(clickedElement).parent().parent().find("input");
	var editTools = $(clickedElement).parent().parent().find(".edit-tools");
	var tools = $(clickedElement).parent().parent().find(".tools");
	var v = clickedSpan.text();

	tools.addClass("hidden");
	editTools.removeClass("hidden");
	clickedSpan.addClass("hidden");
	clickedInput.removeClass("hidden");
	clickedInput.val(v);
	clickedInput.focus();
}
DataTable.prototype.blurEvent = function(ele)
{
	var v = $(ele).val();
	$(ele).parent().find("span").html(v);
	this.allCells().each(function(index,element){
		$(element).find("span").removeClass("hidden");
		$(element).find("input").addClass("hidden");
		$(element).find(".edit-tools").addClass("hidden");
	});	

	var _this = this;

	if(_this.dataBeforeChanged != $(ele).val()){

		var position = _this.getCellIndex($(ele).parent()); 

		var cells = [{
			oldData : _this.dataBeforeChanged,
			newData : $(ele).val(),
			col 	: position.col,
			row 	: position.row,
			element : ele
		}];
		_this.onDataChanged("update",cells);	
	}
	
}
DataTable.prototype.clickEvent = function(clickedElement)
{

}
DataTable.prototype.keyupEvent = function(keyupElement, event)
{
	// 13 : Enter
	// 27 : Esc
	if(event.keyCode == 13 || event.keyCode == 27){
		keyupElement.blur();
	}
}
DataTable.prototype.deleteColumn = function(colIndex)
{

	var col = this.getCellPositionByIndex(0, colIndex).col;

	var _this = this;
	var cells = [];
	var _row = this._ele.rows;
	for(var i = 0; i < _row.length ; i++)
	{
		try{
			var _cell = _row[i].cells[col];
			var position = this.getCellIndex(_cell);

			cells.push({
				oldData : $(_cell).find("span").html(),
				newData : 0,
				col 	: position.col,
				row 	: position.row,
				element : _cell
			});
		}catch(err){}

		_row[i].deleteCell(col);
	}

	this.onDataChanged("delete",cells);
}
DataTable.prototype.deleteRow = function(rowIndex)
{

	var row = this.getCellPositionByIndex(rowIndex, 0).row;
	console.log("ccccc :" + row);
	var cells = [];

	var _row = this._ele.rows[row];

	for(var i = 0; i < this.colLength() ; i++){
		try{
			var _cell = _row.cells[i];
			var position = this.getCellIndex(_cell);
			
			cells.push({
				oldData : $(_cell).find("span").html(),
				newData : 0,
				col 	: position.col,
				row 	: position.row,
				element : _cell
			});
		}catch(err){}
	}
	
	this._ele.deleteRow(row);

	this.onDataChanged("delete",cells);
}
// include thead cell and tbody cell and return in jQuery
DataTable.prototype.allCells = function()
{
	var selector = "#"+this._ele.id + " th, #"+ this._ele.id + " td";
	return $(selector);
}
DataTable.prototype.cell = function(row, column)
{
	// method 1
	var _this = this;
	var _rst = null;
	
	this.allCells().each(function(index, element){


		var _obj = _this.getCellIndex(element);
		if(row == _obj.row && column == _obj.col){
			_rst = element;
			return;
		}
	});
	return _rst;
}
DataTable.prototype.getCellPositionByIndex = function(rowIndex,colIndex)
{

	for(var r = 0; r < this._ele.rows.length; r++)
	{
		var row = this._ele.rows[r];
		for(var c = 0; c < row.cells.length; c++)
		{
			var cell = row.cells[c];
			var index = this.getCellIndex(cell);
			if(index.row == rowIndex && index.col == colIndex){
				return {
					row: r,
					col: c
				}
			}
		}
	}
	
	return null;
}
DataTable.prototype.getCellIndex = function(element)
{
	if(element instanceof jQuery){
		element = element[0];
	}
	var id = element.id;
	// method 2
	var _r = -1;
	var _c = -1;
	var rst = id.split("_");

	_c = rst[rst.length -1];
	_r = rst[rst.length -2];

	return {
		row: _r,
		col: _c
	};
}

jQuery.fn.dataTable = function(options){

	var _default = {
			ns_cell : "dataCell",
			data: [
				[ "", "" , "", ""],
				[ "", "" , "", ""],
				[ "", "" , "", ""],
				[ "", "" , "", ""],
			],
			tools: [
				[ "", "" , "", ""],
				[ "", "" , "", ""],
				[ "", "" , "", ""],
				[ "", "" , "", ""],
			],
			class: [
				[ "", "" , "", ""],
				[ "", "" , "", ""],
				[ "", "" , "", ""],
				[ "", "" , "", ""],
			],
			onDataChanged: function(event){
				console.log(event);
			},
		};

	if(typeof options == "undefined"){
		options = _default;
	}else{
		for(var key in _default){
			if(typeof options[key] == "undefined"){
				options[key] = _default[key];
			}
		}
	}

	new DataTable(this, options);
	return this;
}