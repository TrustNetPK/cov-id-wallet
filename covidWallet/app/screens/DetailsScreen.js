import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import {
  BLACK_COLOR,
  GRAY_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
  BACKGROUND_COLOR,
} from '../theme/Colors';
import {themeStyles} from '../theme/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  delete_credential,
  generate_credential_qr,
} from '../gateways/credentials';
import {showMessage, showAskDialog, _showAlert} from '../helpers/Toast';
import {deleteCredentialByCredId, getItem, saveItem} from '../helpers/Storage';
import OverlayLoader from '../components/OverlayLoader';
import SimpleButton from '../components/Buttons/SimpleButton';
import {analytics_log_show_cred_qr} from '../helpers/analytics';
import {PreventScreenshots} from 'react-native-prevent-screenshots';
import CredQRModal from '../components/CredQRModal';
import RenderValues from '../components/RenderValues';
import ConstantsList from '../helpers/ConfigApp';
import {Buffer} from 'buffer';
import {_handleAxiosError} from '../helpers/AxiosResponse';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';
import {get_local_issue_date, get_local_issue_time} from '../helpers/time';

function DetailsScreen(props) {
  // Credential
  const data = props.route.params.data;

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isGenerating, setGenerating] = useState(false);
  const [pdfURL, setPDFurl] = useState(false);

  // Setting delete Icon
  useLayoutEffect(() => {
    console.log('data', data);
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {/* <MaterialIcons
            onPress={() => sharePDF()}
            style={styles.headerRightIcon}
            size={25}
            name="share"
            padding={30}
          /> */}
          <MaterialIcons
            onPress={() => (!isLoading ? showAlert() : {})}
            style={styles.headerRightIcon}
            size={25}
            name="delete"
            padding={30}
          />
        </View>
      ),
    });
  });

  async function onSuccess() {
    try {
      setIsLoading(true);

      // Delete credentials Api
      let result = await delete_credential(data.credentialId);
      if (result.data.success) {
        deleteCredentialByCredId(data.credentialId);
        showMessage('ZADA Wallet', 'Credential is deleted successfully');
        props.navigation.goBack();
      } else {
        showMessage('ZADA Wallet', result.data.message);
      }

      setIsLoading(false);
    } catch (e) {
      _handleAxiosError(e);
      setIsLoading(false);
    }
  }

  function generateHTML() {
    console.log('data', data);

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    * {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.row {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  padding: 10px;
}
.cell {
  min-height: 75px;
  flex-grow: 1;
  flex-basis: 100%;
}
#ix98 {
  flex-basis: 86.68%;
}
#ih9d {
  flex-basis: 50%;
}
   
  </head>
  <body>
    <body id="i2wh">
      <div class="row" id="itii">
        <div class="cell" id="ih9d">
          <img
            id="ifo2"
            src=${data.imageUrl}
          />
        </div>
        <div class="cell" id="i2yt">
          <div id="ik2g"><b id="i86u">${data.organizationName}</b></div>
        </div>
      </div>
      <div class="row">
        <div class="cell" id="i5lto">
          <div id="ibk3g">Credential Details</div>
          <div id="i0xih">
            ${Object.keys(data.values).map((key, index) => {
              let value = data.values[key];

              return `<div id="i0xih">${key}</div><div id="i0xih">${value}</div>`;
            })}
          </div>
        </div>
        <div class="cell" id="ir6hs">
          <div id="iutjp">Date: ${get_local_issue_time(data.issuedAtUtc)}</div>
        </div>
      </div>
      <div class="row" id="id7t6">
        <div class="cell" id="ig8t8">
  <img
            id="imcyy"
            src="https://api.qrserver.com/v1/create-qr-code/?size=512x512&${
              data.qrCode
            }/>
          <div id="ii0jf">Scan with ZADA Wallet to verify.</div>
        </div>
      </div>
      <div class="row">
        <div class="cell" id="inj3u">
          <img
            id="ibugt"
            src="data:image/jpeg;base64,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"
          />
          <img
            id="ibugt"
            src="data:image/jpeg;base64,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"
          />
          <img
            id="ibugt"
            src="data:image/jpeg;base64,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"
          />
        </div>
      </div>
      <div class="row">
        <div class="cell" id="i0o3v">
          <div id="ijmqg">
            <span id="iizaq"
              >© 2022 All Rights Reserved. ZADA Solutions Pte Ltd.</span
            >
          </div>
        </div>
      </div>
    </body>
  </body>
  <html></html>
</html>`;
    // Object.keys(data.values).map((key, index) => {
    //   let value = data.values[key];
    //   return '<h1>PDF TEST</h1><h1>${value}</h1><h1>PDF TEST</h1><h1>PDF TEST</h1><h1>PDF TEST</h1><h1>PDF TEST</h1><h1>PDF TEST</h1>';
    // });
  }

  async function generatePDF() {
    //geneate HTML from values
    //generateHTML();

    //console.log('test', generateHTML());

    let options = {
      html: generateHTML(),
      fileName: 'ceritificate',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log('file,', file.filePath);
    //let base64URL = Buffer.from(file.filePath).toString('base64');
    // console.log('base64URL', base64URL);

    setPDFurl(file.filePath);
  }

  async function sharePDF() {
    //First create PDF
    generatePDF();

    const shareOptions = {
      title: 'Certificate',
      url: pdfURL,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log('rezlt', JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('error', error);
    }
  }

  async function showAlert() {
    showAskDialog(
      'Are you sure?',
      'Are you sure you want to delete this certificate?',
      onSuccess,
      () => {},
    );
  }

  async function generateQrCode() {
    try {
      setGenerating(true);
      let credentialId = data.credentialId;

      const result = await generate_credential_qr(credentialId);
      if (result.data.success) {
        let signature = result.data.signature;
        let tenantId = result.data.tenantId;
        let keyVersion = result.data.keyVersion;

        // Making QR based on signature and base 64 encoded data
        let qrData = {
          data: Buffer.from(JSON.stringify(data.values)).toString('base64'),
          signature: signature,
          tenantId: tenantId,
          keyVersion: keyVersion,
          type: 'cred_ver',
        };

        let QR = `${JSON.stringify(qrData)}`;

        // Get all credentials
        let credentials = JSON.parse(await getItem(ConstantsList.CREDENTIALS));

        // Find this credential and update it with QR
        let index = credentials.findIndex(
          (item) => item.credentialId == credentialId,
        );
        credentials[index].qrCode = QR;
        await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(credentials));

        // Open QR After Updating Credentials
        data.qrCode = QR;
      } else {
        _showAlert('ZADA Wallet');
      }
      setGenerating(false);
    } catch (error) {
      setGenerating(false);
      _showAlert('ZADA Wallet', error.message);
    }
  }

  useEffect(() => {
    const focusEvent = props.navigation.addListener('focus', () => {
      PreventScreenshots.start();
    });
    const blurEvent = props.navigation.addListener('blur', () => {
      PreventScreenshots.stop();
    });

    return () => {
      focusEvent;
      blurEvent;
    };
  }, []);

  return (
    <View style={[themeStyles.mainContainer]}>
      <View style={styles.innerContainer}>
        {isLoading && <OverlayLoader text="Deleting credential..." />}

        {isGenerating && <OverlayLoader text="Generating credential QR..." />}

        {data.qrCode !== undefined && (
          <CredQRModal
            isVisible={showQRModal}
            onCloseClick={() => {
              setShowQRModal(false);
            }}
            qrCode={data.qrCode}
          />
        )}

        {data.qrCode != undefined ? (
          <View style={styles.topContainer}>
            <Image
              source={require('../assets/images/qr-code.png')}
              style={styles.topContainerImage}
            />
            <SimpleButton
              onPress={() => {
                setShowQRModal(true);
                analytics_log_show_cred_qr();
              }}
              title="Show QR"
              titleColor="white"
              buttonColor={GREEN_COLOR}
            />
          </View>
        ) : (
          <View style={{margin: 15}}>
            <Text style={styles._noQr}>
              You do not have QR of your credential.
            </Text>
            <SimpleButton
              onPress={generateQrCode}
              width={Dimensions.get('window').width * 0.32}
              title="Get QR"
              titleColor={WHITE_COLOR}
              buttonColor={GREEN_COLOR}
              style={{
                marginTop: 10,
                alignSelf: 'center',
              }}
            />
          </View>
        )}

        <RenderValues
          listStyle={{
            marginTop: 10,
          }}
          listContainerStyle={{
            paddingBottom: '10%',
            paddingHorizontal: 15,
          }}
          inputBackground={WHITE_COLOR}
          inputTextColor={BLACK_COLOR}
          inputTextWeight={'bold'}
          inputTextSize={16}
          labelColor={GRAY_COLOR}
          values={data.values}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    width: 200,
    height: 200,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    borderColor: BACKGROUND_COLOR,
    borderWidth: 1,
    backgroundColor: WHITE_COLOR,
    height: '100%',
  },
  topContainerImage: {
    width: '100%',
    height: '100%',
    tintColor: '#C1C1C1',
    position: 'absolute',
  },
  headerRightIcon: {
    paddingRight: 15,
    color: BLACK_COLOR,
  },

  _noQr: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default DetailsScreen;
