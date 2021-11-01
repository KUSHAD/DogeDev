import {
  Document,
  Page,
  Image,
  Text,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import constants from "../constants";
import { useEffect, useState } from "react";
export default function ExpenditurePDF({ data }) {
  const [ammount, setAmmount] = useState("");
  const [paymentModeDetail, setPaymentModeDetail] = useState("");
  useEffect(() => {
    /* eslint-disable */
    function numberToWords(num) {
      const a = [
        "",
        "one ",
        "two ",
        "three ",
        "four ",
        "five ",
        "six ",
        "seven ",
        "eight ",
        "nine ",
        "ten ",
        "eleven ",
        "twelve ",
        "thirteen ",
        "fourteen ",
        "fifteen ",
        "sixteen ",
        "seventeen ",
        "eighteen ",
        "nineteen ",
      ];
      const b = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];
      if ((num = num.toString()).length > 9) return "overflow";
      let n = ("000000000" + num)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return;
      var str = "";
      str +=
        n[1] != 0
          ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
          : "";
      str +=
        n[2] != 0
          ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
          : "";
      str +=
        n[3] != 0
          ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
          : "";
      str +=
        n[4] != 0
          ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
          : "";
      str +=
        n[5] != 0
          ? (str != "" ? "and " : "") +
            (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
            "only"
          : "";
      if (!str.endsWith("only")) str = str + " only";
      return str;
    }
    const amt = numberToWords(data?.amt);
    setAmmount(amt);
  }, [data]);

  useEffect(() => {
    if (data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[0]) {
      setPaymentModeDetail(` With Pan / Aadhar Card Number :${data?.cashMode}`);
    } else if (
      data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[1] ||
      data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[4] ||
      data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[2]
    ) {
      setPaymentModeDetail(
        ` With ${data?.mode} Number :${data?.chequeNo} Bank: ${
          data?.bank
        }  Issue date of ${data?.mode} :${new Date(
          data?.chequeDate
        ).toLocaleDateString()}`
      );
    } else if (data?.mode === constants.SELECT_OPTIONS.INCOME.PAYMENT[3]) {
      setPaymentModeDetail(` With UPI Id Or Phone Number :${data?.upiId}`);
    }
  }, [data]);

  return (
    <Document
      author="Sports Village"
      producer="Sports Village"
      creator="Sports Village"
    >
      <Page style={styles.page} wrap size="A4">
        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Image
            src="/logo512.png"
            style={{
              width: 120,
              height: 120,
              marginRight: "auto",
            }}
          />
          <View
            style={{
              textAlign: "right",
              borderWidth: 2,
              borderColor: "#000",
            }}
          >
            <Text
              style={{
                textTransform: "uppercase",
              }}
            >
              {data?.srNo}
            </Text>
            <Text>
              Date :-{" "}
              <Text
                style={{
                  textTransform: "uppercase",
                }}
              >
                {new Date(data?.date).toLocaleDateString()}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyInner}>
            <Text
              style={{
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: 30,
                fontFamily: "Times-Bold",
              }}
            >
              {data?.type}
            </Text>
            <Text>
              Payment made to <Text style={styles.vars}>{data?.name} </Text>{" "}
              (Mobile Number :<Text style={styles.vars}>{data.ph}</Text>) the
              sum of Rupees <Text style={styles.vars}>{ammount}</Text> in
              account of <Text style={styles.vars}>{data?.desc}</Text> by{" "}
              <Text style={styles.vars}>
                {data?.mode}.{paymentModeDetail}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>
            Rs. <Text style={styles.vars}>{data?.amt}/-</Text>
          </Text>
          <View style={styles.footerInner}>
            <View style={styles.signatureCont}>
              <Text>_________________</Text>
              <Text>Authorised Signature</Text>
            </View>
            <View style={styles.signatureCont}>
              <Text>_________________</Text>
              <Text>Payment Received</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    flexDirection: "column",
  },
  vars: {
    textTransform: "uppercase",
    fontFamily: "Times-Italic",
  },
  body: {
    margin: 10,
    flexDirection: "column",
    height: "50%",
    flexGrow: 1,
    padding: 50,
  },
  bodyInner: {
    height: "100%",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "column",
    paddingRight: 50,
    paddingLeft: 50,
  },
  footerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureCont: {
    flexDirection: "column",
  },
});
