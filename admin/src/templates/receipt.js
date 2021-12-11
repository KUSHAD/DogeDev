import intFormatter from '../intFormatter';
import constants from '../constants';
export default function receiptBill(data) {
	/* eslint-disable */
	function numberToWords(num) {
		const a = [
			'',
			'one ',
			'two ',
			'three ',
			'four ',
			'five ',
			'six ',
			'seven ',
			'eight ',
			'nine ',
			'ten ',
			'eleven ',
			'twelve ',
			'thirteen ',
			'fourteen ',
			'fifteen ',
			'sixteen ',
			'seventeen ',
			'eighteen ',
			'nineteen ',
		];
		const b = [
			'',
			'',
			'twenty',
			'thirty',
			'forty',
			'fifty',
			'sixty',
			'seventy',
			'eighty',
			'ninety',
		];
		if ((num = num.toString()).length > 9) return 'overflow';
		let n = ('000000000' + num)
			.substr(-9)
			.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = '';
		str +=
			n[1] != 0
				? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
				: '';
		str +=
			n[2] != 0
				? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
				: '';
		str +=
			n[3] != 0
				? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
				: '';
		str +=
			n[4] != 0
				? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
				: '';
		str +=
			n[5] != 0
				? (str != '' ? 'and ' : '') +
				  (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
				  'only'
				: '';
		if (!str.endsWith('only')) str = str + ' only';
		return str;
	}
	const amt = numberToWords(data?.amt);
	let details = '';
	if (data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[0]) {
		details = ` With Pan / Aadhar Card Number :${data?.cashMode}`;
	} else if (
		data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
		data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[4] ||
		data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[2]
	) {
		details = ` With ${data?.mode} Number :${data?.chequeNo} Bank: ${
			data?.bank
		}  Issue date of ${data?.mode} :${new Date(
			data?.chequeDate
		).toLocaleDateString()}`;
	} else if (data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[3]) {
		details = ` With UPI Id Or Phone Number :${data?.upiId}`;
	}
	return `
		  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>INCOME</title>
    <style>
		body{
        margin:0;
        padding:0;
      }
      * {
        font-family: Arial, Helvetica, sans-serif;
      }
      .main__container {
        width: 219.21259842519686px;
        max-width: 219.21259842519686px;
      }
      #btnPrint {
        width: 100%;
        height: 30px;
        cursor: pointer;
      }
      .header__container {
        display: flex;
        flex-direction: row;
        height: 100px;
      }
      .header__img {
        width: 100px;
        height: auto;
        margin-right: auto;
      }
      .header__details {
        border: 1px solid #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
      }
      .body__container {
        text-align: center;
      }
      .vars {
        font-style: italic;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        text-transform: uppercase;
      }
      .footer__container {
        margin-top: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .sign__container {
        display: flex;
        flex-direction: column;
      }
      @media print {
        .hidden__print,
        .hidden__print * {
          display: none !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="main__container">
      <div class="header__container">
        <img src=""https://admin-dogedev.web.app/logo192.png" class="header__img" />
        <div class="header__details">
          <strong>${data?.srNo.split('-')[2]}</strong>
          <strong>Date:-${new Date(data?.date).toLocaleDateString()}</strong>
        </div>
      </div>
      <div class="body__container">
        <span class="vars"><strong>${data?.type}</strong></span>
        <p>
          		Received with thanks from <span class="vars">${
								data.name
							}</span>(Identity /Phone
							Number :-
          <span class="vars">${data.ph}</span>)the sum of rupees
          <span class="vars"
            >${amt}</span
          >
          in account of <span class="vars">${data?.desc}</span> by
          <span class="vars">${data?.mode}</span> with<span class="vars">
            ${details}</span>
        </p>
      </div>
      <strong class="amt__container"
        >RS.<span class="vars">${intFormatter(data?.amt)}/-</span></strong
      >
      <div class="footer__container">
        <div class="sign__container">
          <span>................</span>
          Auth. Sign.
        </div>
      </div>
      <div class="hidden__print">
        <button id="btnPrint">Print</button>
      </div>
      <script>
        const $btnPrint = document.querySelector("#btnPrint");
        $btnPrint.addEventListener("click", () => {
          window.print();
        });
      </script>
    </div>
  </body>
</html>
	`;
}
