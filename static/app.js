let sending = false;

let messages = [];


/* =========================
   ELEMENTS
========================= */

const input =
    document.getElementById("input");

const messagesBox =
    document.getElementById("messages");

const typing =
    document.getElementById("typing");

const sendButton =
    document.getElementById("send");


/* =========================
   SEND
========================= */

async function sendMessage() {

    if (sending) return;


    const text =
        input.value.trim();


    if (!text) return;


    sending = true;

    sendButton.disabled = true;


    addMessage(
        "user",
        text
    );


    input.value = "";

    resizeInput();


    showTyping();


    try {

        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: text
                    })
                }
            );


        const data =
            await response.json();


        hideTyping();


        if (!response.ok) {

            addMessage(
                "assistant",
                "❌ " +
                (
                    data.error ||
                    "Terjadi kesalahan."
                )
            );

            return;
        }


        addMessage(
            "assistant",
            data.answer
        );


    } catch (error) {

        hideTyping();


        addMessage(
            "assistant",
            "❌ Server tidak dapat dihubungi."
        );


        console.error(error);

    } finally {

        sending = false;

        sendButton.disabled = false;

        input.focus();
    }
}


/* =========================
   ADD MESSAGE
========================= */

function addMessage(
    role,
    text
) {

    const welcome =
        document.getElementById(
            "welcome"
        );


    if (welcome) {

        welcome.remove();
    }


    const message =
        document.createElement(
            "div"
        );


    message.className =
        "message " + role;


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "avatar";


    avatar.textContent =
        role === "user"
            ? "👤"
            : "🤖";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "content";


    content.textContent =
        text;


    message.appendChild(
        avatar
    );


    message.appendChild(
        content
    );


    messagesBox.appendChild(
        message
    );


    messages.push({

        role: role,

        content: text
    });


    scrollBottom();
}


/* =========================
   TYPING
========================= */

function showTyping() {

    typing.classList.remove(
        "hidden"
    );

    scrollBottom();
}


function hideTyping() {

    typing.classList.add(
        "hidden"
    );
}


/* =========================
   SCROLL
========================= */

function scrollBottom() {

    setTimeout(() => {

        messagesBox.scrollTop =
            messagesBox.scrollHeight;

    }, 50);
}


/* =========================
   NEW CHAT
========================= */

function newChat() {

    messages = [];


    messagesBox.innerHTML = `

        <div
            id="welcome"
            class="welcome"
        >

            <div class="welcome-icon">
                🤖
            </div>

            <h1>
                Halo 👋
            </h1>

            <p>
                Saya Personal AI Anda.
                Ada yang bisa saya bantu?
            </p>

        </div>

    `;


    closeSidebar();

    input.focus();
}


/* =========================
   CLEAR
========================= */

function clearChat() {

    if (
        messages.length === 0
    ) {
        return;
    }


    if (
        !confirm(
            "Hapus percakapan ini?"
        )
    ) {
        return;
    }


    newChat();
}


/* =========================
   SIDEBAR
========================= */

function toggleSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.toggle(
            "open"
        );
}


function closeSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.remove(
            "open"
        );
}


/* =========================
   TEXTAREA
========================= */

input.addEventListener(
    "input",
    resizeInput
);


function resizeInput() {

    input.style.height =
        "auto";


    input.style.height =
        Math.min(
            input.scrollHeight,
            150
        ) + "px";
}


/* =========================
   ENTER
========================= */

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }

    }
);