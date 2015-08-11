// index js

$(document).ready(function(e) 
{
    html5sql.openDatabase("com.kannel.sqladminMovil", "Base de Datos temporal de kannel", 5*1024*1024);
	
	 $("#loadingAJAX").width(window.innerWidth);
     $("#loadingAJAX").height(window.innerHeight);
     
     $("#ajaxgif").css(
	 	{ 
            top: ((window.innerHeight / 2) - 80),
            left: ((window.innerWidth / 2) - 40) 
        });
     $("#loadingAJAX").hide();
	 
	 if (!window.sessionStorage.UserLogin)
	 	window.location = "#inicio";
		
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;	
		
	
	 
});

function loadArchivo()
{
    console.log("metodo 1");
	$.ajax(
	{
		url: "0000000000000001.db",
		dataType: "text",
		success: function(data)
		{
			console.log(data);
		}
	});
	
	console.log("metodo 2");
	$.ajax(
	{
		url: "file:///android_asset/www/0000000000000001.db",
		dataType: "text",
		success: function(data)
		{
			console.log(data);
		}
	});
	
	console.log("metodo 1.1");
	$.ajax(
	{
		url: "com.kannel.sqladminMovil.db",
		dataType: "text",
		success: function(data)
		{
			console.log(data);
		}
	});
	
	console.log("metodo 2.1");
	$.ajax(
	{
		url: "file:///android_asset/www/com.kannel.sqladminMovil.db",
		dataType: "text",
		success: function(data)
		{
			console.log(data);
		}
	});
		
}

$(function ()
{
	if (window.sessionStorage.UserLogin)
	{
		$(".ui-icon-power").text(window.sessionStorage.UserLogin);
	}
	else
	{
		$(".ui-icon-power").text('Log In');
	}
});

function droptable ()
{
	$.post("http://200.30.150.165:8080/webservidor2/mediador.php",
	{
		"cmd": "getTablaDrop",
		"ListaTablas[]": [
							"empresa",
							"unidad_medida",
							"conversion_um",
							"pais",
							"promotor",
							"vc_grupo",
							"vc_productor",
							"vc_finca",
							"q_formulario",
							"vc_variedad",
							"vc_tipo_suelo",
							"vc_certificacion"
						 ] 
	},
	function (data)
	{
		console.log(data);
		
		html5sql.process(data.SQls,
		function()
		{
			console.log("Success Tablas Tiradas");
		},
		function(error, statement)
		{
			console.log("Error: " + error.message + " when processing " + statement);
		});
		
	}, "json");
	
	
}

function crearTablas()
{
	$.post("http://200.30.150.165:8080/webservidor2/mediador.php",
	{
		"cmd": "CreateTables",
		"ListaTablas[]": [
							"unidad_medida",
							"conversion_um",
							"pais",
							"promotor",
							"vc_grupo",
							"vc_productor",
							"vc_finca",
							"q_formulario",
							"vc_variedad",
							"vc_tipo_suelo",
							"vc_certificacion"
						 ] 
	},
	function (data)
	{
		console.log(data);
		
		html5sql.process(data.SQls,
		function()
		{
			console.log("Success Tablas Creadas");
		},
		function(error, statement)
		{
			console.log("Error: " + error.message + " when processing " + statement);
		});
		
	}, "json");
	
	
}

function truncateTable ()
{
	new Messi('&iquest;Esta Seguro de que desea hacer esta operacion? (Punto sin Retorno)', 
	{
		title: 'Sync App', 
		width: (window.innerWidth - 25),
		buttons: 
			[
				{
					id: 0, 
					label: 'Si', 
					val: 'Y'
				}, 
				{
					id: 1, 
					label: 'No', 
					val: 'N'
				}
			], 
		callback: function(val) 
		{ 
			if (val == 'Y')
			{
				droptable();
				crearTablas();
				Messi.alert('Tablas Limpias ... ');
			}
		}
	});
}

function verDatos()
{
	html5sql.process(
	
			[
				{
					"sql": "Select * from datos;",
					"data": [],
					"success": 
					function (transaction, results)
					{
						var LDados = results.rows.length; 
						
						var htmlText = "<table style='width:100%' border='1' cellpadding='0' cellspacing='0'><tr><th>Id</th><th>Nombre</th><th>Pws</th></tr>"
						
						for (i = 0; i < LDados; i++)
						{
							htmlText += "<tr><td>" + results.rows[i].id + "</td>" +
										"<td>" + results.rows[i].nombre + "</td>" +
										"<td>" + results.rows[i].pws + "</td></tr>";
						}
						
						htmlText += "</table>";
						
						$("#tabla").html(htmlText);
						
						console.log(results.rows);
					}
				}
			],
			function()
			{
				$("#result").text("Success Tablas Creadas");
			},
			function(error, statement)
			{
				$("#result").text("Error: " + error.message + " when processing " + statement);
			});   
}

function grabar()
{
	try
	{
		$("#result").text("Insert de datos");
		
		var usuario = $("#tbUserName").val()
		var psw     = $("#tbPassWord").val();
		
		html5sql.process(
			[
				{
					"sql": "INSERT INTO datos (nombre, pws) VALUES (?, ?)",
					"data": [
								usuario,
								psw
							]
				}
			],
			function()
			{
				$("#result").text("Success Tablas Creadas");
			},
			function(error, statement)
			{
				$("#result").text("Error: " + error.message + " when processing " + statement);
			});  
		
	}
	catch (error)
	{
		$("#result").text("Error: " + error.message);
	}
}

function logIn()
{
	var UserName = $("#tbUserName").val();
	var UserPWD = $("#tbPassWord").val();
	
	if (UserName == "" || UserPWD == "")
	{
		new Messi('Todos los campos son requeridos.', 
				{
					title: 'Sync App', 
					titleClass: 'anim error', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Cerrar', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25)
				});
	}
	else
	{
		$("#loadingAJAX").show();
	
		$.post("http://200.30.150.165:8080/webservidor2/mediador.php",
		{
			"user": UserName,
			"pwd": UserPWD
		},
		function (data)
		{
			if (data.ingreso == 1)
			{
				window.sessionStorage.UserLogin = data.nombreUser;
				var Mensage = 'Hola. ' + data.nombreUser;
				
				new Messi(Mensage, 
				{
					title: 'Sync App', 
					titleClass: 'success', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Close', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25),
					callback: function (info)
					{
						$(".ui-icon-power").text(window.sessionStorage.UserLogin);
						window.location = "#LoadTables";
					}
				});
				
			}
			else
			{
				new Messi('Error ... en el Log in, Usuario o Contrase&ntilde;a erroneo', 
				{
					title: 'Sync App', 
					titleClass: 'anim error', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Cerrar', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25)
				});
			}
			
			$("#loadingAJAX").hide();
		}, "json")
		.fail(function(errorData)
		{
			new Messi("Server Error: '" + errorData.responseText + "' ", 
				{
					title: 'Sync App', 
					titleClass: 'anim error', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Cerrar', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25)
				});
			$("#loadingAJAX").hide();
		});
	}
}

function logOut()
{
	window.sessionStorage.removeItem("UserLogin");
	window.location = "index.html";
}

function redirect( x )
{
	switch (x)
	{
		case 0:
			if (!window.sessionStorage.UserLogin)
				logIn();
			else
				logOut();
			break;
	}
}

function getDataTable()
{	
	$("#loadingAJAX").show();
	
	$.post("http://200.30.150.165:8080/webservidor2/mediador.php",
	{
		"cmd": "GetData",
		"tableName[]": [	
						"empresa",
						"unidad_medida",
						"conversion_um",
						"pais",
						"promotor",
						"vc_grupo",
						"vc_productor",
						"vc_finca",
						"q_formulario",
						"vc_variedad",
						"vc_tipo_suelo",
						"vc_certificacion"
					  ]
	},
	function (data)
	{
		var InSql = data.SQls;
		
		var ok = 0;
		var fail = 0;
		var total = InSql.length;
		var info = "";
		
		for (i = 0; i < InSql.length; i++)
		{
				html5sql.process(InSql[i],
				function()
				{
					ok++;
				},
				function(error, statement)
				{
					fail++;
					info += " \n (" + i + ") Error " + error + "; " + statement;
				});  
		}
		
		$("#loadingAJAX").hide();
		
		if (info != "")
		{
				new Messi(info, 
				{
					title: 'Sync App', 
					titleClass: 'anim error', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Cerrar', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25)
				});
		}
		else
		{
			new Messi("Resumen de Proceso \n" + " Transacciones echas " + ok + " de " + total + "; faidas " + fail + " de " + total, 
				{
					title: 'Sync App', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Cerrar', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25)
				});
		}
		
	}, "json")
	.fail(function(errorData)
	{
		console.log(errorData);
		new Messi("Server Error: '" + errorData.responseText + "' ", 
				{
					title: 'Sync App', 
					titleClass: 'anim error', 
					buttons: 
						[
							{
								id: 0, 
								label: 'Cerrar', 
								val: 'X'
							}
						],
					modal: true,
					width: (window.innerWidth - 25)
				});
			$("#loadingAJAX").hide();
	});	
}








