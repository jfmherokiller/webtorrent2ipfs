import * as $ from "jquery"
let ipfsAPI = require("ipfs-api");
import * as WebTorrent from "webtorrent";
import {IpfsFileObject} from "./ipfsInterfaces"
function setup() {
    $('button#add2ipfs').on('click', function (e) {
        e.preventDefault();
        add2ipfs();
        return false
    })
}
$(document).ready(setup);

function indicate(cls, text) {
    $('#alert').addClass('alert-' + cls);
    $('#alert').text(text);
    console.log(cls + ":" + text);
}

function add2ipfs() {
    $('result').hide();

    let url = $('input#url').val().toString().trim();
    if (!url || url.length < 1) {
        return indicate('danger', 'error: url field is empty')
    }

    let endpoint = $('input#api-endpoint').val().toString().trim();
    if (!endpoint) {
        return indicate('danger', 'invalid api endpoint')
    }

    const ipfs = ipfsAPI(endpoint);
    indicate('info', 'working...');
    addTorrent(ipfs, url, function (err, path) {
        if (err) return indicate('danger', 'error: ' + err);
        indicate('success', 'added ' + path);
        console.log(path);
        setResult(path)
    });
}
function addTorrent(ipfs, magnetlink, cb) {
    console.log("ipfs add -w", magnetlink);
    let client = new WebTorrent();
    let numberOfFiles = 0;
    client.add(magnetlink, function (torrent) {
        let filearray = [];
        numberOfFiles = torrent.files.length;
        torrent.files.forEach(function (file) {
            DownloadFileFromTorrentAndCreateIPFSObject(file, function (outfile) {
                filearray.push(outfile);
                if (filearray.length === numberOfFiles) {
                    AddFilesToIpfs(ipfs, filearray, cb)
                }
            });
        })
    })

}
function AddFilesToIpfs(ipfs, ipfsObjects: IpfsFileObject[], cb) {
    ipfs.add(ipfsObjects, function (err, res) {
        let finalhash;
        if (err) return err;
        //check if not array
        if (!Array.isArray(res)) {
            finalhash = res;
        }
        //get outermost hash
        if (Array.isArray(res) && res.length > 1) {
            finalhash = res[res.length - 1]
        }
        //unpin hash
        ipfs.pin.rm(finalhash.hash, {recursive: true});
        console.log(res);
        const path = '/ipfs/' + finalhash.hash + '/';
        console.log(path);

        cb(null, path);
    })

}
function DownloadFileFromTorrentAndCreateIPFSObject(input: WebTorrent.TorrentFile, callback) {
    input.getBuffer(function (err, buffer) {
        if (err) throw err;
        let ipfsdata: IpfsFileObject = {
            //append /tempdir/ to the path to add the needed link
            path: "/tmpdir/"+input.path,
            content: buffer
        };
        callback(ipfsdata);
    })
}

function setResult(path) {
    $('#ipfs-path').text(path);
    $('#result').show();

    const local = window.location.protocol + '//' + window.location.host + path;
    $('#ipfs-gway-local').text(local);
    $('#ipfs-gway-local').attr('href', local);
    $('#iframe-local').attr('src', local);

    const global = "https://ipfs.io" + path;
    $('#ipfs-gway-global').text(global);
    $('#ipfs-gway-global').attr('href', global);
    $('#iframe-global').attr('src', global)
}
