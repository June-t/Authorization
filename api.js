/* VARIABLES DE LA VENTANA EMERGENTE */

const query_model = document.querySelectorAll('.query_model--medium > div'),
    query_toggle = document.querySelectorAll('.top__two button'),
    query_button = document.querySelectorAll('#query'),
    date_of_service = document.querySelector('#date_of_service'),
    create_automatic = document.querySelectorAll('#checkbox_1'),
    check_automatic = document.querySelectorAll('#checkbox_2'),
    options_methods = document.querySelector('#options_methods'),
    /* QUERY_TOGGLE 1/2 & QUERY_MODEL 1/2 */
    query_model_one = query_model[0],
    query_model_two = query_model[1],
    query_toggle_one = query_toggle[0].dataset,
    query_toggle_two = query_toggle[1].dataset;

/* VARIABLES DE SENASA */

const dni = document.querySelector('#DNI'),
    nss = document.querySelector('#NSS'),
    dni_nss = document.querySelector('#DNI_NSS'),
    multi = document.querySelector('#textarea-multi'),
    input_date = document.querySelector('#input-fechaServicio'),
    input_dni = document.querySelector('#srch-ced-afiliado'),
    input_nss = document.querySelector('#srch-nss-afiliado'),
    specialty = document.querySelector('#srch-text-medico'),
    srch_specialty = document.querySelector('#btt-buscar-medico'),
    srch_affiliate = document.querySelector('#btt-buscar-afiliado'),
    clear_srch = document.querySelector('#btt-reset-afiliado'),
    check_status = document.querySelector('#nombreAfiliado');

/* POP CONFIGURATION [X] */

const config_check = () => {
    localStorage.getItem('config') !== null ? config_rebuild() : config_send();
}

const config_send = () => {

    let config = {
        date_of_service: null,
        model: null,
        create_list: null
    }

    function fechDay(id = date_of_service.value) {
        let save_date = `${id[8] + id[9] + '/' + id[5] + id[6] + '/' + id[0] + id[1] + id[2] + id[3]}`;
        config.date_of_service = save_date;
    }

    return localStorage.setItem('config', JSON.stringify(config));
}

const config_rebuild = () => {

    let JSON_received = localStorage.getItem('config');
    let JSON_rebuilt = JSON.parse(JSON_received);

    let config = {
        date_of_service: JSON_rebuilt.date_of_service,
        model: JSON_rebuilt.model,
        create_list: JSON_rebuilt.create_list
    }

    input_date.value = JSON_rebuilt.date_of_service;

    let boolean_check = (input, boolean) => {
        input.forEach((elem, index) => {
            input[index].checked = boolean
        })
    }

    if (JSON_rebuilt.model === true && localStorage.getItem("Arr_Items") !== null) {
        localStorage.removeItem('Arr_Items')
        boolean_check(check_automatic, false);
        document.querySelector('.query_model').style.display = 'grid';
        document.querySelector('#wrap').style.filter = 'blur(2px)';
    } else if (JSON_rebuilt.model === true) {
        boolean_check(check_automatic, true)
        document.querySelector('.query_model').style.display = 'none';
        document.querySelector('#wrap').style.filter = 'blur(0px)';
        data_entry_automatic()
    } else {
        boolean_check(check_automatic, false)
        document.querySelector('.query_model').style.display = 'grid';
        document.querySelector('#wrap').style.filter = 'blur(2px)';
    }


    JSON_rebuilt.create_list === true ?
        boolean_check(create_automatic, true) : boolean_check(create_automatic, false)

    return localStorage.setItem('config', JSON.stringify(config));
}

const config_event = (elem) => {

    let JSON_received = localStorage.getItem('config');
    let JSON_rebuilt = JSON.parse(JSON_received);

    let config = {
        date_of_service: JSON_rebuilt.date_of_service,
        model: JSON_rebuilt.model,
        create_list: JSON_rebuilt.create_list
    }

    function checkButton(id, type) {
        id.checked == true ? (id.checked = true, config[type] = true) :
            (id.checked = false, config[type] = false)

        return localStorage.setItem('config', JSON.stringify(config))
    }

    function fechDay(id = date_of_service.value) {
        let save_date = `${id[8] + id[9] + '/' + id[5] + id[6] + '/' + id[0] + id[1] + id[2] + id[3]}`;
        config.date_of_service = save_date;
        localStorage.setItem('config', JSON.stringify(config))

        input_date.value = save_date;
    }

    elem.id == 'checkbox_1' ? checkButton(elem, 'create_list') :
        elem.id == 'checkbox_2' ? checkButton(elem, 'model') :
        elem.id == 'date_of_service' ? fechDay() : null

}

const check_tab_pop = () => {

    query_toggle_one.toggle == 'true' ? (
        query_model_two.style.display = 'none', query_model_one.appendChild(options_methods)
    ) : query_toggle_two.toggle == 'true' ? (
        query_model_one.style.display = 'none', query_model_two.appendChild(options_methods)
    ) : null;

}

let arr_close = ['#wrap', '.top__one button', '#query'].map((x) => {
    document.querySelector(x).addEventListener('click', () => {
        document.querySelector('.query_model').style.display = 'none';
        document.querySelector('#wrap').style.filter = 'blur(0px)'
    })
})

let arr_display = ['.documents-icons', '.query_end'].map((x) => {
    document.querySelector(x).style.display = 'none';
})

query_toggle.forEach(elem => {

    let func_toggle = (param1, param2, div1, div2) => {
        param1.toggle = false;
        param2.toggle = true;
        div1.style.display = 'none';
        div2.style.display = 'grid';
        div2.appendChild(options_methods);
    }

    elem.addEventListener('click', () => {
        query_toggle_one.toggle == 'true' ?
            func_toggle(query_toggle_one, query_toggle_two, query_model_one, query_model_two) :
            func_toggle(query_toggle_two, query_toggle_one, query_model_two, query_model_one);
    })
});

check_tab_pop()

// COMPROBAR LOS DATOS INICIALES DEL AFILIADO (1)
const return_num = (type, pick, start, end) => {
    let r = '';
    for (let i = start; i < end; i++) {
        r += pick[i];
    }
    type == input_dni || type == input_nss ? type.value = r : r;
    return r.replace('undefined', '');
}

const add_status = (elem, arg, style) => {
    elem.children[1].textContent = arg
    elem.children[1].style.color = style;
}

const func_check_data = (num1 = null, num2 = null) => new Promise((res, rej) => {

    specialty.value = 'nutricion'
    srch_specialty.click()

    let check_time = (selector, time) => {
        if (selector.value == "") {
            setTimeout(() => {
                check_time(selector, time)
            }, time);
        } else if (selector.value == "No hay Registros") {
            rej('LOS DATOS SON INCORRECTOS')
        } else {
            res('LOS DATOS LLEGARON SASTIFACTORIAMENTE');
        }
    }

    num1 == null ? null : (input_dni.value = num1, input_dni.select())
    num2 == null ? null : input_nss.value = num2;

    srch_affiliate.click();
    check_time(check_status, 500)
})

const func_check_data_two = (num, pick) => new Promise((res, rej) => {

    specialty.value = 'nutricion'
    srch_specialty.click()

    let url = 'http://www.arssenasa3.gob.do/centros/consultaAfiliado/index.asp?q=y';
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let cont = 0;

    let request_the_data = (num) => {
        fetch(url, {
                headers: myHeaders,
                method: "POST",
                body: "nss=" + `${num}` + "&cedula=&contrato="
            }).then(res => res.text())
            .then(html => {
                let parser = new DOMParser(),
                    doc = parser.parseFromString(html, "text/html"),
                    dni_ext = doc.querySelector('#rCedula').value.replace(/[-_]/g, '', '');

                if (dni_ext == return_num(null, pick, 0, 11)) {
                    add_status(query_end_cedula, 'CONCUERDA ✔️', 'var(--color-j-four)');
                    res('LA CÉDULA COINCIDE CON LA QUE INGRESARON');
                } else {
                    add_status(query_end_cedula, 'NO CONCUERDA ❌', 'var(--color-j-three)')
                    res('LA CÉDULA NO COINCIDE CON LA QUE INGRESO');
                }

                // rej('LOS DATOS SON INCORRECTOS')
            }).catch(err => alert(`${'INICIA SESSIÓN EN CONSULTA // ERROR : ' + err}`))
    }

    let check_data = () => {

        if (input_dni.value === '000-0000000-0' || edadAfiliado.value <= 15) {

            add_status(query_end_nss, 'CONCUERDA', 'var(--color-j-four)');
            request_the_data(return_num(num, pick, 12, 21));

        } else if (input_dni.value.replace(/[-_]/g, '', '') == return_num(num, pick, 0, 11) &&
            input_nss.value == return_num(num, pick, 12, 21)) {

            add_status(query_end_cedula, 'CONCUERDA', 'var(--color-j-four)');
            add_status(query_end_nss, 'CONCUERDA', 'var(--color-j-four)');
            res('AMBOS DATOS CONCUERDAN');

        } else if ((input_dni.value.replace(/[-_]/g, '', '') == return_num(num, pick, 0, 11)) == true &&
            (input_nss.value == return_num(num, pick, 12, 21)) == false) {

            add_status(query_end_cedula, 'CONCUERDA', 'var(--color-j-four)');
            add_status(query_end_nss, 'NO CONCUERDA', 'var(--color-j-three)');
            res('AMBOS DATOS CONCUERDAN');

        } else if ((input_dni.value.replace(/[-_]/g, '', '') == return_num(num, pick, 0, 11)) == false &&
            (input_nss.value == return_num(num, pick, 12, 21)) == true) {

            add_status(query_end_cedula, 'NO CONCUERDA', 'var(--color-j-three)');
            add_status(query_end_nss, 'CONCUERDA', 'var(--color-j-four)');
            res('AMBOS DATOS CONCUERDAN');

        } else {
            rej('NO ENTRA EN EL RANGO DE EDAD');
        }

    }

    let check_time = (selector, time) => {
        if (selector.value == "") {
            setTimeout(() => {
                check_time(selector, time)
            }, time);
        } else if (selector.value == "No hay Registros" && cont == 0) {
            cont++;
            clear_srch.click()
            return_num(input_dni, pick, 0, 11);
            input_dni.select()
            srch_affiliate.click();
            check_time(check_status, 500)
        } else if (selector.value == "No hay Registros" && cont == 1) {
            rej('LOS DATOS SON INCORRECTOS')
        } else {
            check_data()
        }
    }

    num == null ? null : return_num(input_nss, pick, 12, 21);

    srch_affiliate.click();
    check_time(check_status, 500)
})

// COMPROBAR EL STATUS DEL AFILIADO & EDAD    (2)

const func_check_status = () => new Promise((res, rej) => {
    let checkAge = () => {
        let ageValue = Number(edadAfiliado.value);

        ageValue >= 0 && ageValue <= 18 ? res(131397) :
            ageValue >= 19 && ageValue <= 100 ? res(131396) :
            alert('COMPRUEBE LA EDAD / ' + `${'(' + ageValue + ') AÑOS'}`);
    }

    regimenAfiliado.value === "CONTRIBUTIVO" ? rej('REGIMEN : CONTRIBUTIVO') :
        estadoAfiliado.value === "RECHAZADO" ? rej('ESTADO : RECHAZADO') :
        checkAge()

})

// INGRESAR EL PRODUCTO DEL AFILIADO          (3)

const func_get_product = (code) => new Promise((res, rej) => {

    let click_func = (selector) => {
        document.querySelector(selector).click()
    }

    let value_func = (selector, value) => {
        document.querySelector(selector).value = value;
    }

    let wait_div = (paramFunc, selector, time) => {
        if (document.querySelector(selector) != null) {
            paramFunc();
            return;
        } else {
            setTimeout(() => {
                wait_div(paramFunc, selector, time);
            }, time);

        }
    }

    let pw_1 = () => {
        document.querySelector('.agregarProcedimientos').click()
        setTimeout(() => {
            click_func('.ui-dialog-titlebar-close')
            let arr_display = ['.documents-icons', '.query_end'].map((x) => {
                document.querySelector(x).style.display = '';
            })
            document.querySelector('.bttNap-move').appendChild(document.querySelector('.documents-icons'))
        }, 500);
    }

    setTimeout(() => {
        click_func('[href="#ambulatorios"]')
        value_func('.srch-cdg-diagnostico', 'z719')
        click_func('.btt-buscar-diagnostico')
        setTimeout(() => {
            click_func('.btt-buscar-procedimientos')
            value_func('#srch-cdg-procedimiento', code)
            setTimeout(() => {
                click_func('#btt-buscar-procedimientos')
                click_func('#btt-buscar-procedimientos')
                setTimeout(() => {
                    wait_div(pw_1, '.agregarProcedimientos', 500);
                    res('EL PROCESO SE REALIZO PERFECTAMENTE')
                }, 100);
            }, 500);
        }, 500);
    }, 500);


})

const func_status_person = () => {

    let ageValue = Number(edadAfiliado.value);
    let styleElem = document.head.appendChild(document.createElement("style"));

    // regimen & estado
    regimenAfiliado.value == 'SUBSIDIADO' ?
        add_status(query_end_regimen, regimenAfiliado.value, 'var(--color-j-four)') : add_status(query_end_regimen, regimenAfiliado.value, 'var(--color-j-three')

    estadoAfiliado.value == 'OK (CORRECTO)' ?
        add_status(query_end_estado, 'ACTIVO', 'var(--color-j-four)') :
        add_status(query_end_estado, estadoAfiliado.value, 'var(--color-j-three)')


    dni.textLength == 0 ? null : (
        dni.value === input_dni.value.replace(/[-_]/g, '', '') ? (
            add_status(query_end_nss, 'NO SE INGRESO', 'var(--color-j-secundary)'),
            add_status(query_end_cedula, 'CONCUERDA', 'var(--color-j-four)')
        ) : null
    );

    nss.textLength == 0 ? null : (
        nss.value === input_nss.value ? (
            add_status(query_end_nss, 'CONCUERDA', 'var(--color-j-four)'),
            add_status(query_end_cedula, 'NO SE INGRESO', 'var(--color-j-secundary)')
        ) : null
    );

    ageValue >= 5 && ageValue <= 15 ? (
        add_status(query_end_edad, `${'APLICA ' + '(' + ageValue + ' AÑOS)'}`, 'var(--color-j-four)'),
        styleElem.innerHTML = "#query_end_edad td:nth-child(2)::after {content: 'desarrollo';}"
    ) : ageValue >= 35 && ageValue <= 64 ? (
        add_status(query_end_edad, `${'APLICA ' + '(' + ageValue + ' AÑOS)'}`, 'var(--color-j-four)'),
        styleElem.innerHTML = "#query_end_edad td:nth-child(2)::after {content: 'vitalidad';}"
    ) : add_status(query_end_edad, `${'NO APLICA ' + '(' + ageValue + ' AÑOS)'}`, 'var(--color-j-three)')

    elemento = document.querySelector('.bttNap-move')
    query_end = document.querySelector('.query_end')
    elemento.appendChild(query_end)
}

// GENERACIÓN DE LA AUTORIZACIÓN & PDF´S

const copy_clipboard = () => {
    let textField = document.createElement('textarea'),
        napId = document.querySelector('#napStatus h3 span').textContent;
    textField.innerText = napId;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
}

const open_ext_windows = () => {
    let AutIde = document.querySelector('.fmAutResp'),
        AutIdeCode = AutIde.dataset.aut,
        napId = document.querySelector('#napStatus h3 span'),
        w = window.open(`${'http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/mod-consultas/autorizacion.asp?prt=1&id=' + AutIdeCode}`, napId.textContent, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=500,height=500,left = 390,top = 50');
    setTimeout(function () {
        w.document.title = napId[0].textContent;
    }, 1000);
}

const open_iframe = () => {
    let AutIde = document.getElementsByClassName('fmAutResp')[0];
    let AutIdeCode = AutIde.dataset.aut;
    let urlPdf = `${'http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/mod-consultas/autorizacion.asp?prt=1&id=' + AutIdeCode}`;
    printPdf = function (url) {
        var iframe = this._printIframe;
        if (!this._printIframe) {
            iframe = this._printIframe = document.createElement('iframe');
            iframe.classList.add('urlPdf');
            document.body.appendChild(iframe);
            iframe.style.display = 'none';
            iframe.onload = function () {
                setTimeout(function () {
                    iframe.focus();
                    iframe.contentWindow.print();
                }, 1000);
            };
        }

        iframe.src = url;
    }

    printPdf(urlPdf)

}
/* 

const affiliate_lists = (num) => {

    let url = 'http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/ajax/ax-afiliado.asp?intPrmContrato=&intPrmNSS=' + `${num.toString()}` + '&srtPrmCedula=';

    fetch(url)
        .then(response => response.json())
        .then((data) => {
            console.table(data.datos[0])
        })
        .catch(error => console.error(error));
}

const continuing_generations = () => {

    let Arr_Items = JSON.parse(localStorage.getItem("Arr_Items"));

    let checkLocal = () => {
        Arr_Items.length === 0 ? (
            localStorage.removeItem("Arr_Items"),
            data_entry_automatic()
        ) : process_delete();
    }

}

*/

/* DIGITACIÓN DE LOS AFILIADOS  - MANUAL [X] */

const data_entry_manual = () => {

    /* COMPROBAR QUE CAMPO FUE RELLENADO */

    let repeat_promise = (param1, param2) => {
        func_check_data(param1, param2)
            .then(() => func_check_status())
            .then(result => func_get_product(result))
            .then(() => func_status_person())
            .catch(err => console.log(err))
        config_rebuild()
    }

    if (dni.value == '' && nss.value == '' && dni_nss.value == '') {
        alert('INGRESE UN DATO')
    } else if (dni.textLength == 11) {
        repeat_promise(dni.value, null)
    } else if (nss.textLength == 9) {
        repeat_promise(null, nss.value)
    } else if (dni_nss.textLength == 21) {
        func_check_data_two(dni_nss.value, dni_nss.value)
            .then(() => func_check_status())
            .then(result => func_get_product(result))
            .then(() => func_status_person())
            .catch(err => console.log(err))
        config_rebuild()
    }
}

/* DIGITACIÓN DE LOS AFILIADOS - AUTOMATICO [X] */

const data_entry_automatic = () => {

    let repeat_promise = (param1, param2) => {
        func_check_data_two(param1, param2)
            .then(() => func_check_status())
            .then(result => func_get_product(result))
            .then(() => func_status_person())
            .catch(err => console.log(err))
    }

    let return_num = (type, start, end) => {
        let r = '';
        for (let i = start; i < end; i++) {
            r += type[0][i];
        }
        return r;
    }

    let delete_element = () => {

        let Arr_Items = JSON.parse(localStorage.getItem("Arr_Items"));

        let checkLocal = () => {
            Arr_Items.length === 0 ? (
                localStorage.removeItem("Arr_Items")
            ) : process_delete();
        }

        let process_delete = () => {
            let to_delete = Arr_Items[0],
                index = Arr_Items.indexOf(to_delete);
            Arr_Items.splice(index, 1);
            localStorage.setItem('Arr_Items', JSON.stringify(Arr_Items));
        }

        checkLocal();
    }

    // si hay arreglos pero no se ingreso nada, se comprueba y continua FALSE (TRUE) && TRUE
    if (localStorage.getItem('Arr_Items') !== null && 0 >= multi.value.length) {
        let dataLocal = JSON.parse(localStorage.getItem('Arr_Items')),
            two_number = `${return_num(dataLocal, 0, 11) + ' ' + return_num(dataLocal, 12, 21)}`;

        repeat_promise(two_number, two_number) // promise
        delete_element() // delete data local
        // si se ingreso un numero
    } else if ((0 >= multi.value.length) === false) {
        let arr_textarea = document.querySelector('#textarea-multi').value.split("\n"),
            two_number = `${return_num(arr_textarea, 0, 11) + ' ' + return_num(arr_textarea, 12, 21)}`;
        localStorage.setItem("Arr_Items", JSON.stringify(arr_textarea));

        repeat_promise(two_number, two_number) // promise
        delete_element() // delete data local
    } else {
        alert('INGRESE LOS DATOS');
    }
}

const delete_items = () => {
    localStorage.removeItem('Arr_Items')
}

config_check()


/* INICIALIZAR EL SCRIPT 


¿De qué trata este programa y cúal es la solución?

R: SENASA, es una página en dónde generas autorizaciones médicas mediante un formulario en dónde hay que rellenar cierto tipo de información para que luego de haber rellenado, se te retorna una autorización médica y una factura de ello.

¿Qué cosas hay que rellenar en ese formulario?

1.- Información del afiliado, ósea, la cédula o número de seguro social de él. (DATO EXTERNO)
2.- Colocar el tipo de especialidad "NUTRICIÓN" (ACCIÓN)
3.- Fecha del servicio (ACCIÓN Y DATO EXTERNO)
4.- Colocar el Servicio Ambulatorio, en este caso un código para el diagnostico (ACCIÓN)
5.- Colocar el producto del afiliado (ACCIÓN)
6.- Generar la autorización médica (ACCIÓN PROPIA)

AFILIADO (CÉDULA|NSS) > SCRIPT (MANUAL) > AHORRO DE DIGITAR DATOS > AUTORIZACIÓN MÉDICA Y REPETIR

AFILIADO (CÉDULA|NSS) > SCRIPT (AUTOMATICO) > AHORRO DE DIGITAR DATOS > AUTORIZACIÓN MÉDICA Y CONTINUA CON EL SIGUIENTE AFILIADO (CÉDULA|NSS)

Problematicas de esto

R: El hecho de repetir esta acción durante un largo rato, cansa y no es automatizado, además de que cuando es un niño hay que hacer otra comprobación de datos en dónde lo cúal alarga el proceso.

SOLUCIÓN

"""MANUAL"""

+PLUS

VENTANA EMERGENTE

1./ FECHA DE SERVICIO
2./ TOGGLE_BUTTON (SEGUIR CON EL SIGUIENTE AFILIADO)
3./ MODEL (SI ES MANUAL O AUTOMATICO)

Crear una configuración en dónde la condición seria si algún campo fue modificado, cambiar dicha configuración, en caso de que no, continúa.

Guardar la configuración que hizo primeramente
Colocar la configuración que guardo la primera vez pero si hubo un cambio en los campos, re-guardar.

1.- Crear una ventana emergente con campos en dónde puedan colocar el tipo de dato que tienen

    :: CÉDULA       : Busca el afiliado por la cédula.
    :: NSS          : Busca el afiliado por el número de seguro social.
    :: CÉDULA & NSS : Busca el afiliado por ambos datos (si no lo encuentra por uno, lo busca por el otro)
                      esto también es una medida para comprobar que ambos datos estén bien.

2.- Con los datos que se ingresaron en la ventana emergente, realizar el proceso de digitación

    :: Utilizar los datos previamente tomados para terminar la consulta sin la necesidad de interactuar con botones, ventanas o campos de textos.

3.- Luego de realizar el proceso de digitación, generar la autorización médica del afiliado

    :: Realizar la autorización médica (MANUAL)
    :: Generar el PDF de dicha autorización sin la necesidad de colocar el NAP en el DIALOGO

4.- Comprobación de los datos

    :: Si es un afiliado niño, hacer una comprobación en otra página para saber si la cédula puesta es igual a la que aparece en dicha página.
    :: Comprobar el regimen del afiliado

"""AUTOMATICO"""

1.- Realizar las últimas acciones pero de manera automatica
    :: Realizar un listado de todo los datos recogido (DATOS EXTERIORES) para comprobar el regimen y si el afiliado es niño, comprobar que es el misma cédula


*/

/* CONSUMIR EL GET
        fetch("http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/ajax/ax-afiliado.asp?intPrmContrato=&intPrmNSS=021349298&srtPrmCedula=")
          .then(response => response.json())
					.then((data) => {
          	console.table(data.datos[0])
        	})
          .catch(error => console.error(error));

let input_esp = document.querySelectorAll('#srch-text-medico'),
    input_nss = document.querySelectorAll('#srch-nss-afiliado')[0],
    input_ced = document.querySelectorAll('#srch-ced-afiliado')[0],
    btt_search = document.querySelectorAll('#btt-buscar-afiliado')[0],
    btt_new_search = document.querySelectorAll('#btt-reset-afiliado')[0],
    person_name = document.querySelectorAll('#nombreAfiliado')[0],
    person_surname = document.querySelectorAll('#apellidoAfiliado')[0],
    regimen = document.querySelectorAll('#regimenAfiliado')[0],
    edad = document.querySelectorAll('#edadAfiliado')[0],
    div_list_person = document.querySelector('.list-person ul'),
    arrList = ['050384626', '023199235', '005633987', '152767702', '145727567', '045123368', '013580518', '168808570', '001420205', '010579913', '015881810', '014337684', '000670681', '023643101', '032616497', '060901963', '011058224', '023744563', '050978918', '006403537', '054222203', '147201312', '162874587', '157118328', '041733822', '016003444', '021912838', '179232643', '011471652', '171715762', '161087491', '162172264', '167564574', '006763135', '002838180', '061371656', '023868604', '012580286', '158910387', '604350598', '002837298', '145887495', '013186710', '024714186', '077834542', '012675410', '030570014', '084773706', '024629942'];


const htmlinsert = (person) => {

    let name = person.name,
        surname = person.surname,
        dni = person.dni,
        nss = person.nss,
        regimen = person.regimen,
        edad = person.edad;

    let full_name = {
        "name": `${name + ' ' + surname}`,
        "cedula": dni,
        "nss": nss,
        "regimen": `${(regimen == 'SUBSIDIADO') ? regimen + ' <span class="check-valid">(✔)</span>' : regimen + ' <span class="check-valid-no">(⨉)</span>' }`,
        "edad": `${ (edad >= 5 && edad <=  15) ? edad + ' <span class="check-valid">(✔)</span>' :
                    (edad >= 35 && edad <= 64) ? edad + ' <span class="check-valid">(✔)</span>' : edad + ' <span class="check-valid-no">(⨉)</span>'}`,
    }

    let func_id = () => {

        let key = Object.keys(full_name),
            data_add = document.getElementById('data_add'),
            tr = document.createElement('tr');

        for (let i = 0; i < key.length; i++) {
            let fl_name = key[i];
            let td_a = document.createElement('td');
            td_a.innerHTML = `${full_name[fl_name]}`;
            tr.appendChild(td_a)
            data_add.appendChild(tr);
        }
    }

    func_id()

}

const htmlcontainer = () => {
    let htmldiv = document.createElement('div');
    let htmlStructure =
        `<table>
        <thead>
          <tr class="data_aut">
            <th>NOMBRE</th>
            <th>CÉDULA</th>
            <th>NSS</th>
            <th>REGIMEN</th>
            <th>EDAD</th>
            <th>AUTORIZACIÓN</th>
          </tr>
        </thead>
        <tbody id="data_add">
        </tbody>
        </table>`;



    document.body.appendChild(htmldiv);
    htmldiv.innerHTML = htmlStructure;
}

htmlcontainer()



for (let i = 0; i < arrList.length; i++) {
    setTimeout(function timer() {
        input_nss.value = arrList[0];
        btt_search.click();
        setTimeout(() => {
            arrList.shift()
            htmlinsert({
                name: person_name.value,
                surname: person_surname.value,
                dni: input_ced.value,
                nss: input_nss.value,
                regimen: regimen.value,
                edad: edadAfiliado.value
            });
            btt_new_search.click();
        }, 500);
    }, i * 1000);
}


/*

1./ Imprimir los valores de las personas con datos útiles [x]
2./ Guardar dichos valores en LocalStorage, para que no se pierdan al reiniciar la página [ ]
3./ Crear una especie de modo "automatico", en dónde tome los valores imprimidos y haga una generación
de código de manera rápida, omitiendo el darle click al botón de NAP y ahorrando el copiado y pegado de NAP [ ]
4./ Al igual que crear una especie de modo automatico, hay que tener una opción para apagarlo en caso de que se quiera hacer otro procedimiento de manera manual.
5./ Darle estilos necesarios para que se puedan diferenciar cuando haya una incongruencia.

¿Para que es esto?

Para poder dejar la monotonia de la misma tarea la realizarla, al generar los PDF.

*/