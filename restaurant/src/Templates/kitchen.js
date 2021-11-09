export default function kitchenRecpt(data) {
	return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>KITCHEN</title>
      <style>
      * {
				font-size: 15px;
			  font-family: "Times New Roman";
			}
			td,
			th,
			tr,
			table {
				border-top: 1px solid black;
				border-collapse: collapse;
			}
			td.description,
			th.description {
				width: 80px;
				max-width: 80px;
			}
			td.quantity,
			th.quantity {
				width: 80px;
				max-width: 80px;
				text-align: right;
			}
			td.price,
			th.price {
				width: 80px;
				max-width: 80px;
				text-align: right;
			}
			.centered {
				text-align: center;
				align-content: center;
			}
			.ticket {
				width: 155px;
				max-width: 155px;
			}
			.hidden-print{
  			margin-top:50px;
			}
			@media print {
				.hidden-print,
				.hidden-print * {
					display: none !important;
				}
				.ticket {
					display: block;
				}
			}
    </style>
    </head>
    <body>
      <div class="ticket">
        <p class="centered">
          KITCHEN
        </p>
        <table>
          <caption><strong>Table :- ${data.name}</strong></caption>
          <thead>
            <tr>
              <th class="description">Item</th>
              <th class="quantity">Qty.</th>
              <th class="price"></th>
            </tr>
          </thead>
          <tbody>
            ${data?.orders.map(
							order => `
                <tr>
                  <td class="description">${order?.item}</td>
                  <td class="quantity">${order?.quantity}</td>
                  <td class="price">${order?.isParcel ? 'Parcel' : 'Table'}</td>
                </tr>
            `
						)}
          </tbody>
        </table>
      </div>
      <button id="btnPrint" class="hidden-print">Print</button>
      <script>
        const $btnPrint = document.querySelector("#btnPrint");
				$btnPrint.addEventListener("click", () => {
  				window.print();
				});
      </script>
    </body>
  </html>
  `;
}
