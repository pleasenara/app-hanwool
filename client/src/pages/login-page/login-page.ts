import Component from '../../components/component';
import HttpStatus from 'http-status';
import { UserApi } from '../../api';
import ActionManager, { LOGIN_ACTION } from '../../utils/action-manager';
import Router from '../../router';

class LoginPage extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('login-page');
		this.render();
		this.listener();
	}

	listener() {
		const signinBtn = this.dom.querySelector('.signinBtn') as HTMLButtonElement;
		const signupBtn = this.dom.querySelector('.signup-page-btn') as HTMLSpanElement;
		const githubBtn = this.dom.querySelector('.githubBtn') as HTMLSpanElement;
		const googleBtn = this.dom.querySelector('.googleBtn') as HTMLSpanElement;

		signinBtn.addEventListener('click', this.signinBtnClickHandler.bind(this));
		signupBtn.addEventListener('click', () =>
			Router.notify({ key: 'loadPage', data: { pageName: 'signup' } })
		);

		githubBtn.addEventListener('click', () => {
			location.href = '/api/auth/github';
		});

		googleBtn.addEventListener('click', () => {
			location.href = '/api/auth/google';
		});
	}

	async signinBtnClickHandler() {
		const emailInput = this.dom.querySelector('.input-email') as HTMLInputElement;
		const passwordInput = this.dom.querySelector('.input-password') as HTMLInputElement;

		let response;
		try {
			response = await UserApi.emailLogin({
				email: emailInput.value,
				password: passwordInput.value,
			});
		} catch (err) {
			throw new Error(`fail to login email user (${emailInput.value}): ${err.stack}`);
		}
		if (response.status === HttpStatus.OK || response.status === HttpStatus.NOT_MODIFIED) {
			const data = await response.json();
			console.info(data.message);
			const serviceId = data.result.serviceId;
			ActionManager.notify({ key: LOGIN_ACTION, data: { serviceId } });
		} else {
			console.error(`not match user`, response.status);
		}
	}

	render() {
		this.dom.innerHTML = `
		<span class="title-label login-row">
			Sign In With
		</span>
		
		<div class="social-sector login-row">
			<span class="githubBtn socialBtn">
				<img src="/images/icon-github.png" alt="GITHUB">
				<span>Github</span>
			</span>
			<span class="googleBtn socialBtn">
				<img src="/images/icon-google.png" alt="GOOGLE">
				<span>Google</span>
			</span>
		</div>

		<div class="login-sector login-row">
			<div class="">
				<span class="">
					이메일 ID
				</span>
			</div>
			<div class="">
				<input class="input-email" type="text" name="email" placeholder="hkb05@gmail.com" />
			</div>

			<div class="">
				<span class="">
					비밀번호
				</span>
			</div>
			<div class="">
				<input class="input-password" type="password" name="pw" placeholder="비밀번호(영문+숫자, 8~20자)" >
			</div>

			<div class="">
				<button class="signinBtn">
					Sign In
				</button>
			</div>			
		</div>

		<div class="signup-sector login-row">
			<span class="">
				Not a member?
			</span>

			<span class="signup-page-btn">
				Sign up now
			</span>
		</div>
		`;
	}

	getDom() {
		return this.dom;
	}
}

export default LoginPage;
