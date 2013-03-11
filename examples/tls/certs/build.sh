#! /usr/bin/env bash

#exit on error
set -e

#generate ca cert
openssl req -new -x509 -days 9999 -config ca1.cnf -keyout ca1-key.pem -out ca1-cert.pem

#generate ca cert 2
openssl req -new -x509 -days 9999 -config ca2.cnf -keyout ca2-key.pem -out ca2-cert.pem

gen-agent () {

  AGENT="$1"
  CA="$2"

  test -e "$AGENT".cnf || {
     echo expected config file: "$AGENT".cnf
     exit 1
  }

  test -e "$CA"-key.pem || {
     echo expected config file: "$CA"-key.pem
     exit 1
  }

  # generate agent
  openssl genrsa -out "$AGENT"-key.pem 1024

  # generate csr
  openssl req -new -config "$AGENT".cnf \
    -key "$AGENT"-key.pem -out "$AGENT"-csr.pem

  # sign agent certificate request with ca
  openssl x509 -req \
    -days 9999 \
    -passin "pass:password" \
    -in "$AGENT"-csr.pem \
    -CA "$CA"-cert.pem \
    -CAkey "$CA"-key.pem \
    -CAcreateserial \
    -out "$AGENT"-cert.pem

  # verify agent file
  openssl verify -CAfile "$CA"-cert.pem "$AGENT"-cert.pem

}

gen-agent agent1 ca1
gen-agent agent2 ca1

gen-agent agent3 ca2

