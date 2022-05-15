/* VARIABLES DE LA VENTANA EMERGENTE */

const query_model = document.querySelectorAll('.query_model--medium > div'),
    query_toggle = document.querySelectorAll('.top__two button'),
    query_button = document.querySelectorAll('#query'),
    date_of_service = document.querySelector('#date_of_service'),
    create_automatic = document.querySelectorAll('#checkbox_1'),
    check_automatic = document.querySelectorAll('#checkbox_2'),
    options_methods = document.querySelector('#options_methods'),
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
            config.model = boolean
        })
    }


    if (JSON.parse(localStorage.getItem("Arr_Items")).length === 0) {

        localStorage.removeItem('Arr_Items')
        boolean_check(check_automatic, false)
        // window.location.href = 'http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/index.asp';

    } else if (JSON_rebuilt.model === true && localStorage.getItem('Arr_Items') !== null) {

        boolean_check(check_automatic, true);
        document.querySelector('.query_model').style.display = 'none';
        document.querySelector('#wrap').style.filter = 'blur(0px)';
        data_entry_automatic()

    }

    JSON_rebuilt.create_list === true ? null : null

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

    let checkButton = (id, type) => {
        id.checked == true ? (id.checked = true, config[type] = true) :
            (id.checked = false, config[type] = false)

        type == 'create_list' && config.create_list == true ?
            query_button[1].setAttribute('onclick', 'data_entry_automatic_option()') :
            query_button[1].setAttribute('onclick', 'data_entry_automatic()')


        return localStorage.setItem('config', JSON.stringify(config))
    }

    let fechDay = (id = date_of_service.value) => {
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

let arr_close = ['#wrap', '.top__one button', '.medium__manual #query', '.medium__automatic #query'].map((x) => {
    document.querySelector(x).addEventListener('click', () => {
        document.querySelector('.query_model').style.display = 'none';
        document.querySelector('#wrap').style.filter = 'blur(0px)'
    })
})

let arr_display = ['.documents-icons', '.query_end'].map((x) => {
    document.querySelector(x).style.display = 'none';
})

document.querySelector('.overlap-group').addEventListener('click', () => {
    window.location.href = 'http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/index.asp';
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

const return_num_number = (type, start, end) => {
    let r = '';
    for (let i = start; i < end; i++) {
        r += type[0][i];
    }
    return r;
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
            res('LA CÉDULA CONCUERDA PERO NO EL NSS');

        } else if ((input_dni.value.replace(/[-_]/g, '', '') == return_num(num, pick, 0, 11)) == false &&
            (input_nss.value == return_num(num, pick, 12, 21)) == true) {

            add_status(query_end_cedula, 'NO CONCUERDA', 'var(--color-j-three)');
            add_status(query_end_nss, 'CONCUERDA', 'var(--color-j-four)');
            res('EL NSS CONCUERDA PERO LA CÉDULA NO');

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
            document.querySelector('#ambulatorios > div').appendChild(document.querySelector('#all_content'))
            // query_end.before(document.querySelector('.documents-icons')) // befores
            // document.querySelector('.bttNap-move').appendChild(document.querySelector('.documents-icons'))
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
}

const automatic_options_generation = () => {

    let bttNap = document.querySelector('#btt-nap');
    bttNap.click();

    let css_tr_id = document.querySelectorAll('.css_tr'),
        id = document.querySelector('#srch-contrato-afiliado'),
        arr_id = [];

    css_tr_id.forEach((elem) => {
        arr_id.push(elem.children[0])
    })

    var result = arr_id.filter(aut => aut.textContent == id.value);

    setTimeout(() => {
        let aut = document.querySelector('.bttNap-move #napStatus').childNodes[1].childNodes[1].textContent;
        result[0].parentNode.children[6].innerHTML = `${'<span onclick="copy_clipboard_list(this)" data-label="aut">' + aut + '</span>'}`;
    }, 2000);
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

const copy_clipboard_list = (item) => {
    let textField = document.createElement('textarea');
    textField.innerText = item.textContent;
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

// GENERACIÓN DE LA AUTORIZACIÓN RÁPIDA

const htmlinsert = (person, num) => {

    let id = person.contrato,
        nombre = person.nombres,
        apellido = person.apellidos,
        cedula = person.cedula.replace(/[-_]/g, '', ''),
        cedulaTitular = person.cedulaTitular.replace(/[-_]/g, '', ''),
        nss = person.nss,
        estado = person.estado,
        regimen = person.regimen;

    let css_tbody = document.querySelector('.css_tbody'),
        css_tr = document.createElement('div'),
        number = num;

    let return_num_text = (type, start, end) => {
        let r = '';
        for (let i = start; i < end; i++) {
            r += type[i];
        }
        return r;
    }

    let func_check_status = (num_text) => {

        if (estado == 'OK (CORRECTO)' && regimen == 'SUBSIDIADO' && return_num_text(num_text, 12, 21) == nss && return_num_text(num_text, 0, 11) == cedula) {
            return '<span data-label="ad">ADMITIDO</span>'
        } else if (estado == 'OK (CORRECTO)' && regimen == 'SUBSIDIADO' && return_num_text(num_text, 12, 21) == nss && return_num_text(num_text, 0, 11) == cedulaTitular) {
            return '<span data-label="ad">ADMITIDO</span>'
        } else {
            return '<span data-label="re">RECHAZADO</span>'
        }
    }

    let obj_person = {
        "id": id,
        "nombre": `${nombre + ' ' + apellido}`,
        "cedula": `${return_num_text(number, 0, 11) == cedula ? 
                    '<span data-label="ad">'+ cedula +'</span>' : return_num_text(number, 0, 11) == cedulaTitular ? 
                    '<span data-label="ad">'+ cedulaTitular +' ✔️</span>' : '<span data-label="re">'+ cedula +' ❌</span>' }`,

        "nss": `${return_num_text(number, 12, 21) == nss ? 
                    '<span data-label="ad">'+ nss +'</span>' : '<span data-label="re">'+ nss +'</span>' }`,

        "estado": `${estado == 'OK (CORRECTO)' ? '<span data-label="ad">'+ estado +'</span>' : '<span data-label="re">'+ estado +'</span>'}`,

        "regimen": `${regimen == 'SUBSIDIADO' ? '<span data-label="ad">'+ regimen +'</span>' : '<span data-label="re">'+ regimen +'</span>'}`,

        "status": func_check_status(number)
    }

    let htmldiv = `
                            <div class="css_td" data-label="id">${obj_person.id}</div>
                            <div class="css_td" data-label="nombre">${obj_person.nombre}</div>
                            <div class="css_td" data-label="cedula">${obj_person.cedula}</div>
                            <div class="css_td" data-label="nss">${obj_person.nss}</div>
                            <div class="css_td" data-label="estado">${obj_person.estado}</div>
                            <div class="css_td" data-label="regimen">${obj_person.regimen}</div>
                            <div class="css_td" data-label="table_aut">0</div>
                            <div class="css_td" data-label="status">${obj_person.status}</div>
                            <div class="css_td" data-label="ex"><button onclick="delete_affiliate_list(this)"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 473 473" style="enable-background:new 0 0 473 473;" xml:space="preserve">
                            <g>
                                <path d="M324.285,215.015V128h20V38h-98.384V0H132.669v38H34.285v90h20v305h161.523c23.578,24.635,56.766,40,93.477,40   c71.368,0,129.43-58.062,129.43-129.43C438.715,277.276,388.612,222.474,324.285,215.015z M294.285,215.015   c-18.052,2.093-34.982,7.911-50,16.669V128h50V215.015z M162.669,30h53.232v8h-53.232V30z M64.285,68h250v30h-250V68z M84.285,128   h50v275h-50V128z M164.285,403V128h50v127.768c-21.356,23.089-34.429,53.946-34.429,87.802c0,21.411,5.231,41.622,14.475,59.43   H164.285z M309.285,443c-54.826,0-99.429-44.604-99.429-99.43s44.604-99.429,99.429-99.429s99.43,44.604,99.43,99.429   S364.111,443,309.285,443z"></path>
                                <polygon points="342.248,289.395 309.285,322.358 276.323,289.395 255.11,310.608 288.073,343.571 255.11,376.533 276.323,397.746    309.285,364.783 342.248,397.746 363.461,376.533 330.498,343.571 363.461,310.608  "></polygon>
                            </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                            </svg></button></div>
                        `;

    css_tr.classList.add('css_tr');
    css_tr.innerHTML = htmldiv;
    css_tbody.appendChild(css_tr)

    //  let data_label_cedula = document.querySelector('[data-label="cedula"]'),
    //      data_label_nss = document.querySelector('[data-label="nss"]'),
    //      data_label_estado = document.querySelector('[data-label="estado"]'),
    //      data_label_regimen = document.querySelector('[data-label="regimen"]'),
    //      data_label_id = document.querySelector('[data-label="id"]'),
    //      data_label_status = document.querySelector('[data-label="status"]');
}

const affiliate_lists = (num, num1) => {

    let url = 'http://www.arssenasa3.gob.do/centros/PortalAutorizaciones/ajax/ax-afiliado.asp?intPrmContrato=&intPrmNSS=' + `${num.toString()}` + '&srtPrmCedula=';

    fetch(url)
        .then(response => response.json())
        .then((data) => {
            htmlinsert(data.datos[0], num1)
        })
        .catch(error => console.error(error));
}

const delete_affiliate_list = (elem) => {
    elem.parentElement.parentNode.remove()
}

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

const data_entry_automatic_option = () => {

    document.querySelector('.table_scroll_options').style.display = 'flex'

    if ((0 >= multi.value.length) === false) {

        let arr_textarea = document.querySelector('#textarea-multi').value.split("\n"),
            arrLenght = arr_textarea.length;

        for (var i = 0; i < arrLenght; i++) {
            let two_number =
                `${return_num_number(arr_textarea, 0, 11) + ' ' + return_num_number(arr_textarea, 12, 21)}`;
            affiliate_lists(return_num_number(arr_textarea, 12, 21), two_number)
            arr_textarea.shift()
        }

    } else {
        alert('INGRESE LOS DATOS');
    }
}

const automatic_option_list = () => {

    var repeat_promise = (param1, param2) => {

        return new Promise((resolve, reject) => {
            func_check_data(param1, param2)
                .then(() => func_check_status())
                .then(result => func_get_product(result))
                .then(() => func_status_person())
                .then(() => setTimeout(() => {
                    resolve("Resolved siguiente afiliado")
                }, 2000))
                .catch(err => console.log(reject("Rejected")))
        })
    }

    var item = document.querySelectorAll('.css_tr'),
        arr_item = []

    item.forEach((elem) => {
        arr_item.push(elem.children[3].textContent)
    })

    arr_item.shift() // delete [nss]

    var repeat_repeat = () => {
        repeat_promise(null, arr_item[0])
            .then((res) => {
                setTimeout(() => {
                    automatic_options_generation()
                    setTimeout(() => {
                        open_ext_windows()
                        setTimeout(() => {
                            clear_srch.click()
                            arr_item.shift()
                            setTimeout(() => {
                                repeat_repeat();
                            }, 1000);
                        }, 2500);
                    }, 300);
                }, 100);
            })
            .catch((rej) => console.log(rej))
    }

    repeat_repeat()
}


const delete_items = () => {
    localStorage.removeItem('Arr_Items')
}

config_check()