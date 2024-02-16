import { Auth } from "../skama_code/auth/auth.js";
import { My } from "../skama_code/api/agent.js";
import home from "./home.js";
import menu_mod from "./menu_mod.js";

export default function login(temp_engine) {
    const auth = new Auth();

    temp_engine.after_render((temp_engine) => {
        menu_mod(temp_engine);
    
        temp_engine.add_event("#val", "click", () => {
            const is_checked = $("#box-remember").is(":checked");
            const token = $("#in-token").val();
            auth.store = is_checked;
            auth.login(token)
        });
    
        temp_engine.add_event("#cancel", "click", () => {
            $("#in-token").val("");
            $("#box-remember").prop("checked", false);
        });
    });

    auth.done((agent) => {
        My.agent = agent;
        if(auth.store) localStorage.setItem("token", agent.token)
        home(temp_engine);
    })

    auth.fail((errors) => {
        $(".errors").html("");
        errors.forEach(error => {
            $(".errors").append(`<p>${error}</p>`);
        });
    })

    temp_engine.render(`templates/auth/login.html`);
}