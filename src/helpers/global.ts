class GlobalHelper {
  public isValidUUID(id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      id,
    );
  }

  public replaceSpecialChar(input: string) {
    return input.replaceAll(/[\s'"<>(),;&!?+#=*]/g, '-');
  }
}

export default new GlobalHelper();
