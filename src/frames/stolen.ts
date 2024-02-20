const html = String.raw;
export default {
    name: 'poster',
    logic: () => null,
    content: () => html`
        <frame-image src="/images/poster.png" />
        <frame-button>
            🔳 Try Demo
        </frame-button>
        <frame-button action="link" target="${process.env.STOLEN_REDIRECT_URL}">
            👩‍🎤 View original cast
        </frame-button>
    `
};
