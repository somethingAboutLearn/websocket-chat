(function (window, document) {
    let _webSocket = {
        ws: null,
        // url: "ws://localhost:3333",
        url: "ws://websocket.jialei.online",
        protocol: null,

        /**
         * 
         * @param {String} url 
         * @param {String} protocol 
         */
        _connect(url = this.url, protocol = this.protocol) {
            this.ws = new WebSocket(url, protocol)
        },

        /**
         * 
         * @param {Number} code 
         * @param {String} reason 
         */
        _close(code = 1000, reason = "正常关闭") {
            this.ws.close(code, reason)
        },

        /**
         * 
         * @param {*} data 
         */
        _send(data) {
            this.ws.send(data)
        },

        /**
         * 
         * @param {Function} callback 
         */
        _receive(callback) {
            this.ws.addEventListener("message", (event) => {
                callback(event.data);
            });
        }
    }

    window._webSocket = _webSocket
})(window, document);


(function (window, document) {
    let setNameBtn = document.querySelector(".user-name button");
    setNameBtn.addEventListener("click", function (event) {
        setName();
    })

    say()

    function setName() {
        let inputEl = document.querySelector(".user-name input"),
            name = inputEl.value;

        if (!name) return

        showPage()
        window._user = name
        _webSocket._connect("ws://localhost:3333", name)
        _webSocket._receive(function (data) {
            addChar(data)
        })
    }

    function showPage() {
        let namePage = document.querySelector(".user-name");
        let weChart = document.querySelector(".char");
        namePage.classList.add("hidden");
        weChart.classList.remove("hidden")
    }

    function say() {
        let input = document.querySelector(".enter"),
            send = document.querySelector(".send");

        send.addEventListener("click", function (event) {
            if (!input.value) return

            let data = {
                type: 'message',
                content: input.value,
                user: _user
            }
            _webSocket._send(JSON.stringify(data))
            input.value = ''
        })
    }

    function addChar(data) {
        let char = document.querySelector(".char-area"),
            children = document.createElement(`div`);

        children.classList.add('msg')

        data = JSON.parse(data)

        if (data.user == _user) {
            children.classList.add('my')
            children.innerHTML =
                `
                    <span class="message">${data['content']}</span>
                    :<span class="name">我(${data['user']})</span>
                `;
        }

        if (data.user != _user) {
            children.classList.add('other')
            children.innerHTML =
                `
                    <span class="name">${data['user']}</span>:
                    <span class="message">${data['content']}</span>
                `;
        }
        char.appendChild(children)
    }
})(window, document);