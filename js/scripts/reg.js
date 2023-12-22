import { Modal } from "../skama_code/ui/modal.js";
import { Auth } from "../skama_code/auth/auth.js";
import { My } from "../skama_code/api/agent.js";
import home from "./home.js";
import menu_mod from "./menu_mod.js";

export default function reg(temp_engine) {
    let active = false;
    let auth = new Auth(true);
    let modal = new Modal("reg-modal", temp_engine);

    function render_reg() {
        temp_engine.render(`templates/reg.html`);
        modal.load("templates/reg_modal.html")
    }

    modal.add_class("ext-modal");
    temp_engine.after_render(menu_mod);

    render_reg();

    temp_engine.add_event("#ok", "click", () => {
        home(temp_engine);
    });

    temp_engine.add_event("#forget_reg", "click", () => {
        My.agent = null;
        auth.unload_token();
        modal.close();
        render_reg();
    });

    temp_engine.add_event("#val", "click", () => {
        if (!active) {
            active = true;
            let name = $("#in-name").val();
            let faction = $("#in-faction").val();
            auth.register({
                name: name,
                faction: faction
            });
        }
    });

    temp_engine.add_event("#cancel", "click", () => {
        $("#in-name").val("");
        $("#in-faction").val("");
    });

    auth.done((agent) => {
        $(".show-token").text(agent.token);
        modal.show();
        My.agent = agent;
        active = false;
    }).fail((errs) => {
        $(".errors").html("");
        errs.forEach(err => {
            $(".errors").append(`
                <p>${err}</p>
            `);
        });
        active = false;
    });
}